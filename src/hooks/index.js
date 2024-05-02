import { useMemo } from 'react'

export const useResultIndex = connections => {
  return useMemo(() => {
    return connections
      .find(connection => connection?.sourceHandle?.startsWith('result-'))
      ?.sourceHandle?.split('-')[1]
  }, [connections])
}

export const useMergedData = nodesData => {
  return useMemo(() => {
    return nodesData.reduce((acc, nodeData) => {
      return { ...acc, ...nodeData?.data }
    }, {})
  }, [nodesData])
}

export const useResult = (connections, nodesData) => {
  const resultIndex = useResultIndex(connections)
  const mergedData = useMergedData(nodesData)

  return useMemo(() => {
    return mergedData.results?.[resultIndex]
  }, [mergedData, resultIndex])
}
