export type TransPositionValue = (value: number | string) => number;

// 转换为number类型
export const transPositionValue:TransPositionValue = (value: number | string):number => {
    if (typeof value === 'string') value = Number(value) as number
    return value
}