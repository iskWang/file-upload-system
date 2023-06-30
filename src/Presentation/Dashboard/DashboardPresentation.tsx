import React from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Breadcrumbs } from '@blueprintjs/core'

import { useDashboardContext } from 'Container/Dashboard'
import { useAppContext } from 'Container/App'
import { DashboardDataType } from 'Container/Dashboard/type'

import { Table } from 'Component'

import * as styles from './DashboardPresentation.styles'

const HeaderSection = () => {
  const navigate = useNavigate()

  const currSearchDir = useParams()['*'] || ''

  let items: any[] = ['']

  if (currSearchDir) {
    // filter: remove last empty string
    const subPaths = currSearchDir.split('/').map((key: string) => key).filter(n => n)
    items.push(...subPaths)
  }

  items = items.map((key) => {
    let href = '/dashboard'

    if (key) {
      const matchIdx = currSearchDir.indexOf(key)
      href += `/${currSearchDir.substring(matchIdx, -1)}`
      href += key
    }

    return {
      text: key === '' ? 'root' : key,
      href,
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()

        navigate(href)
      }
    }
  })

  return (
    <div className={styles.header}>
      <Breadcrumbs items={items}/>
      <button onClick={() => navigate(`/upload?currSearchDir=${currSearchDir}`)}>Upload</button>
    </div>
  )
}

const TableSection = () => {
  const { currentUser } = useAppContext()
  const { data, handleOnDelete } = useDashboardContext()

  if (!data || data.length === 0) return null

  const renderRow = (item: DashboardDataType) => {
    return (
      <tr key={item.Key}>
        <td>
          {
            item.isDir
              ? <Link to={`/dashboard/${item.Key}`}>{item.displayKey}</Link>
              : <a href={`https://${currentUser?.bucketName}/${item.Key}`} rel="noreferrer" target="_blank">{item.displayKey}</a>
          }
        </td>
        <td>{item.LastModified && new Date(item.LastModified).toISOString()}</td>
        <td>{item.Owner?.DisplayName}</td>
        <td>
          {
            item.preview?.original && (
              <img className={styles.previewImg} src={item?.preview?.original} alt={item.Key} />
            )
          }
        </td>
        <td>
          {
            item.isDir !== true && handleOnDelete && <button onClick={handleOnDelete(item)}>Delete</button>
          }
        </td>
      </tr>
    )
  }

  return (
    <Table
      data={data}
      renderHeader={() => (
        <tr>
          <th>Name</th>
          <th>LastModified</th>
          <th>Owner</th>
          <th>Preview</th>
        </tr>
      )}
      renderRow={renderRow}
    />
  )
}

const DashboardPresentation = () => {
  return (
    <div>
      <HeaderSection />
      <TableSection />
    </div>
  )
}

export default DashboardPresentation