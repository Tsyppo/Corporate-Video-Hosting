import React from 'react'
import styled, { keyframes } from 'styled-components'

const loadingAnimation = keyframes`
  0% { width: 0; }
  100% { width: 100%; }
`

const PageLoader = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: #007bff;
    z-index: 9999;
    animation: ${loadingAnimation} 2s ease-in-out forwards;
`

const LoadingBar: React.FC = () => {
    return <PageLoader />
}

export default LoadingBar
