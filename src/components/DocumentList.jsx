import React from 'react'
import classnames from 'classnames'
import './DocumentList.css'

const DocumentListHeader = () => (
  <div className="document-list-header">
    <p className="document-list-header__document">Document</p>
    <p className="document-list-header__upload-date">Upload date</p>
  </div>
)

const NoDocumentsFound = ({ className }) => (
  <p className={classnames('no-documents-found', className)}>
    No documents found
  </p>
)

const PictureAsPdfIcon = ({ className }) => (
  <svg
    className={className}
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
  </svg>
)

const DocumentListItem = ({ filename, lastModified }) => (
  <li className="document-list-item">
    <PictureAsPdfIcon className="document-list-item__icon" />
    <div className="document-list-item__text-content">
      <p className="document-list-item__link">
        <span className="document-list-item__filename">{filename}</span>
      </p>
    </div>
    <p className="document-list-item__last-modified">
      {lastModified && lastModified.format('YYYY-MM-DD hh:mm')}
    </p>
  </li>
)

const DocumentList = ({ documents, className }) => {
  if (!documents || documents.length === 0) {
    return (
      <div className={classnames('document-list', className)}>
        <NoDocumentsFound className="document-list__notfound" />
      </div>
    )
  }

  return (
    <div className={classnames('document-list', className)}>
      <DocumentListHeader />
      <ul className="document-list__list">
        {documents.map(d => <DocumentListItem key={d.filename} {...d} />)}
      </ul>
    </div>
  )
}

export default DocumentList