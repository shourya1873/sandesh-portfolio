import Cal, { getCalApi } from '@calcom/embed-react';
import React, { useEffect } from 'react';

export default function CalComCalendar() {
    useEffect(() => {
        (async function() {
            const cal = await getCalApi({ 'namespace': '15min' });
            cal('ui', { 'hideEventTypeDetails': false, 'layout': 'month_view' });
        })();
    }, []);
    return (
        <section className="bg-black text-white py-16 px-6 lg:px-24">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4">Career Consultation</h2>
                <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">
                    One-on-one career support for developers at any stage.
                    Ask questions, get clarity, and move forward with confidence.
                </p>
            </div>
            <Cal namespace="15min"
                 calLink="sandesh-s-yhfchh/15min"
                 style={{ width: '100%', height: '100%', overflow: 'scroll' }}
                 config={{ 'layout': 'month_view' }}
            ></Cal>
        </section>
    );
};
