import { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
}

export const TradingViewWidget = ({ symbol }: TradingViewWidgetProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create widget script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof TradingView !== 'undefined') {
        new TradingView.widget({
          symbol: `DERIV:${symbol}`,
          interval: '1',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_top_toolbar: false,
          container_id: 'tradingview_widget',
        });
      }
    };
    container.current?.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return <div id="tradingview_widget" ref={container} className="w-full h-full" />;
}; 