"""Calculate descriptive insights from manually exported GA4 funnel/report totals.
Run: python3 docs/analyze_metrics.py docs/metrics_summary.csv
This does not fetch GA4, synthesize visitors, or perform causal inference.
"""
import csv, sys
from pathlib import Path

def ratio(a,b):
    return f'{100*a/b:.1f}%' if b else 'N/A (zero denominator)'

def main():
    source=Path(sys.argv[1] if len(sys.argv)>1 else 'docs/metrics_summary.csv')
    results=['# GA4 descriptive analysis','', 'Source: manually supplied GA4 exports. All revenue is simulated demo revenue.', '']
    with source.open(newline='',encoding='utf-8-sig') as f:
        for row in csv.DictReader(f):
            if not all(row.get(k,'').strip() for k in ['view_item_users','add_to_cart_users','begin_checkout_users','purchase_users','purchases','item_revenue']):
                results.append(f"## {row['segment']}\n\nNo results: fill every numeric field from GA4 first.\n")
                continue
            try:
                counts=[int(row[k]) for k in ['view_item_users','add_to_cart_users','begin_checkout_users','purchase_users','purchases']]
                revenue=float(row['item_revenue'])
            except ValueError:
                raise SystemExit('Counts must be integers; revenue must be a plain number without currency symbols or commas.')
            views,adds,checkout,buyers,orders=counts
            if min(*counts,revenue)<0 or not views>=adds>=checkout>=buyers or orders<buyers:
                raise SystemExit(f"Invalid {row['segment']}: use ordered closed-funnel user counts; purchases must be at least purchase users.")
            results.extend([f"## {row['segment']}",'',f'- Product viewers → cart: {ratio(adds,views)} ({adds}/{views})',f'- Cart → checkout: {ratio(checkout,adds)} ({checkout}/{adds})',f'- Checkout → purchase: {ratio(buyers,checkout)} ({buyers}/{checkout})',f'- Viewer → purchase: {ratio(buyers,views)} ({buyers}/{views})',f'- Average demo order item value: INR {revenue/orders:.2f}' if orders else '- Average order value: N/A'])
            stages=[('Product view → cart',views-adds,views),('Cart → checkout',adds-checkout,adds),('Checkout → purchase',checkout-buyers,checkout)]
            stage,lost,base=max(stages,key=lambda x:x[1])
            results.extend([f'- Largest absolute user loss: {stage}: {lost} users ({ratio(lost,base)} of stage entrants).','', 'Interpretation: inspect this stage by device/channel. This is a prioritization signal, not evidence of a cause or guaranteed uplift. Do not sum overlapping users across device rows.', ''])
    out=source.with_name('insights.md');out.write_text('\n'.join(results),encoding='utf-8');print(f'Written {out}')

if __name__=='__main__': main()
