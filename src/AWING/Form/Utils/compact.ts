/**
 * Lọc ra các giá trị Item với điều kiện Boolean(Item) = true
 * @param value: array | any
 */
export default <TValue>(value: TValue[]) => (Array.isArray(value) ? value.filter(Boolean) : []);
