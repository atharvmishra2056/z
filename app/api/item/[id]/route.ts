// app/api/item/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const LZT_BASE = "https://api.lzt.market";

async function translateToEnglish(text: string): Promise<string> {
    if (!text) return "";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const res = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ru|en`,
            { signal: controller.signal }
        );
        clearTimeout(timeout);
        const data = await res.json();
        return data?.responseData?.translatedText || text;
    } catch {
        return text;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const token = process.env.LZT_TOKEN;
    if (!token) {
        return NextResponse.json(
            { error: 'LZT_TOKEN not configured' },
            { status: 500 }
        );
    }

    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    try {
        const url = `${LZT_BASE}/${id}`;
        console.log('🔍 Fetching item:', url);

        const apiResp = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
            cache: 'no-store',
        });

        console.log('📡 Status:', apiResp.status);

        if (!apiResp.ok) {
            const errorText = await apiResp.text();
            console.error('❌ Error:', errorText);

            if (apiResp.status === 404) {
                return NextResponse.json(
                    { error: 'Account not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { error: `LZT API Error: ${apiResp.statusText}` },
                { status: apiResp.status }
            );
        }

        const text = await apiResp.text();
        let json;

        try {
            json = JSON.parse(text);
        } catch {
            console.error('Invalid JSON:', text.slice(0, 200));
            return NextResponse.json(
                { error: 'Bad response from LZT API' },
                { status: 502 }
            );
        }

        // Translate title and description
        const translated = {
            ...json,
            title: await translateToEnglish(json.title),
            description: await translateToEnglish(json.description || ""),
        };

        console.log('✅ Item fetched and translated');
        return NextResponse.json(translated);
    } catch (error) {
        console.error('💥 Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}