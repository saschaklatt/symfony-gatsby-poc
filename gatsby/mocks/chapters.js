const casual = require("casual").de_DE

const generateChaptersPerModule = chapterTypes => [
  {
    id: casual.uuid,
    type: chapterTypes[0],
  },
  {
    id: casual.uuid,
    type: chapterTypes[1],
  },
]

module.exports = ({ moduleCount, chapterTypes }) => {
  const chaptersPerModule = Array.from({ length: moduleCount }, () =>
    generateChaptersPerModule(chapterTypes)
  )
  return chaptersPerModule
}
