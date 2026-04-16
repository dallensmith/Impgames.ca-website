import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export async function GET() {
    // 1. Verify Authentication
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check Environment Configuration
    const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
    const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

    if (!ZONE_ID || !API_TOKEN) {
        return NextResponse.json({ error: "not_configured" }, { status: 200 });
    }

    const ENDPOINT = "https://api.cloudflare.com/client/v4/graphql";

    // 3. Define GraphQL Query (Last 24 Hours)
    const query = `
      query GetZoneAnalytics($zoneTag: String!, $since: String!, $until: String!) {
        viewer {
          zones(filter: { zoneTag: $zoneTag }) {
            # Summary Metrics
            summary: httpRequests1hGroups(
              filter: { datetime_geq: $since, datetime_lt: $until },
              limit: 1000
            ) {
              sum {
                requests
                pageViews
                bytes
              }
              uniq {
                uniques
              }
            }
            # Top Countries
            countries: httpRequestsAdaptiveGroups(
              filter: { datetime_geq: $since, datetime_lt: $until },
              orderBy: [count_DESC],
              limit: 5
            ) {
              count
              dimensions { clientCountryName }
            }
            # Top Devices
            devices: httpRequestsAdaptiveGroups(
              filter: { datetime_geq: $since, datetime_lt: $until },
              orderBy: [count_DESC],
              limit: 5
            ) {
              count
              dimensions { clientDeviceType }
            }
          }
        }
      }
    `;

    const now = new Date();
    const since = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const until = now.toISOString();

    try {
        const response = await fetch(ENDPOINT, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query,
                variables: {
                    zoneTag: ZONE_ID,
                    since,
                    until
                }
            })
        });

        const result = await response.json();

        if (result.errors && result.errors.length > 0) {
            console.error("Cloudflare GraphQL Error:", result.errors);
            return NextResponse.json({ error: result.errors[0].message }, { status: 500 });
        }

        const zone = result.data?.viewer?.zones?.[0];
        
        if (!zone) {
            return NextResponse.json({ error: "Zone not found or access denied" }, { status: 404 });
        }

        // Aggregate Summary
        const summaryTotals = zone.summary.reduce((acc: any, curr: any) => {
            acc.requests += curr.sum.requests || 0;
            acc.pageViews += curr.sum.pageViews || 0;
            acc.bytes += curr.sum.bytes || 0;
            acc.peakUniques = Math.max(acc.peakUniques, curr.uniq.uniques || 0);
            return acc;
        }, { requests: 0, pageViews: 0, bytes: 0, peakUniques: 0 });

        // Map Countries & Devices
        const countries = zone.countries.map((c: any) => ({
            name: c.dimensions.clientCountryName,
            requests: c.count
        }));

        const devices = zone.devices.map((d: any) => ({
            type: d.dimensions.clientDeviceType,
            requests: d.count
        }));

        return NextResponse.json({
            summary: {
                requests: summaryTotals.requests,
                pageViews: summaryTotals.pageViews,
                uniques: summaryTotals.peakUniques,
                bandwidth: (summaryTotals.bytes / (1024 * 1024)).toFixed(2) + " MB"
            },
            countries,
            devices,
            lastUpdate: now.toISOString()
        });
    } catch (e: any) {
        console.error("Fetch Cloudflare Stats Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
