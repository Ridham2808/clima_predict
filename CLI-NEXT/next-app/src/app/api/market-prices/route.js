import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { marketPrices } = await import('@/data/staticData');
        // Randomize prices slightly to simulate live feed
        const dynamicPrices = marketPrices.map(item => {
            const fluctuation = (Math.random() - 0.5) * 50; // Random change between -25 and +25
            const newPrice = Math.round(item.price + fluctuation);
            const changeVal = ((fluctuation / item.price) * 100).toFixed(1);

            return {
                ...item,
                price: newPrice,
                change: fluctuation >= 0 ? `+${changeVal}%` : `${changeVal}%`,
                trend: fluctuation >= 0 ? 'up' : 'down',
                lastUpdate: new Date().toISOString()
            };
        });
        return NextResponse.json(dynamicPrices);
    } catch (error) {
        console.error('Market Prices GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
