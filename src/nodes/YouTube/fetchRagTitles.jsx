export const fetchRagTitles = ({
  store,
  videoId,
  setRagTitles,
  generate30SecondPacks,
  setSpinner,
}) => {
  setSpinner(true)
  store.socket.emit(
    'ragTitles',
    { url: 'https://www.youtube.com/watch?v=' + videoId },
    re => {
      setSpinner(false)
      setRagTitles(re)
      generate30SecondPacks(re)
    }
  )
}
