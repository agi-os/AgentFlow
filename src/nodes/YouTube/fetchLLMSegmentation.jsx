export const fetchLLMSegmentation = (store, ragTitles, setOutput2) => {
  store.socket.emit(
    'ragTitleSegmentation',
    {
      transcript: ragTitles
        .map(({ time, text }) => `${time} ${text}`)
        .join('\n'),
    },
    re => {
      setOutput2(re)
    }
  )
}
