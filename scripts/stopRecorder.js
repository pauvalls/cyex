window.removeEventListener('click', clicked)
window.removeEventListener('beforeunload', beforeunload)
checkInput()

console.log(
`
describe('empty spec', () => {
  it('passes', () => {
      ${commandList.toString().replaceAll(");,", ");\n")}
  })
})`
)

