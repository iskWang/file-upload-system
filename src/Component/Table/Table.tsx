import { HTMLTable } from '@blueprintjs/core'

import { TableProps } from './type'

import * as styles from './Table.styles'

const Table = (props: TableProps) => {
  return (
    <HTMLTable className={styles.container}>
      {
        props.data && (
          <>
            <thead>{props.renderHeader && props.renderHeader()}</thead>
            <tbody>{props.renderRow && props.data.map(props.renderRow)}</tbody>
          </>
        )
      }
    </HTMLTable>
  )
}

export default Table