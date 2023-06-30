
export type TableProps = {
  data?: any[]
  renderHeader?: () => JSX.Element
  renderRow?: (item?: any, index?: number) => JSX.Element
}