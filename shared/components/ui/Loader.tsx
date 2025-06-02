import React from "react"
import ContentLoader from "react-content-loader"

const LoaderComponent = (props: any) => (
  <ContentLoader
    speed={2}
    width="100%" // ocupa todo el ancho del padre
    height={80} // altura generosa para una fila
    backgroundColor="#f3f3f3"
    foregroundColor="#e0e0e0"
    style={{ width: '100%' }}
    {...props}
  >
    {/* Simula celdas de una tabla */}
    <rect x="0" y="20" rx="4" ry="4" width="15%" height="20" />
    <rect x="17%" y="20" rx="4" ry="4" width="15%" height="20" />
    <rect x="34%" y="20" rx="4" ry="4" width="10%" height="20" />
    <rect x="46%" y="20" rx="4" ry="4" width="15%" height="20" />
    <rect x="63%" y="20" rx="4" ry="4" width="12%" height="20" />
    <rect x="78%" y="20" rx="4" ry="4" width="10%" height="20" />
    <rect x="90%" y="20" rx="4" ry="4" width="8%" height="20" />
  </ContentLoader>
)

export default LoaderComponent
