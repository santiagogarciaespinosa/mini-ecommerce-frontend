const fmt = new Intl.NumberFormat("es-CO", {
style: "currency",
currency: "COP",
maximumFractionDigits: 0,
});


export function formatMoney(n: number | string) {
const asNumber = typeof n === "string" ? Number(n) : n;
return fmt.format(Number.isFinite(asNumber) ? asNumber : 0);
}