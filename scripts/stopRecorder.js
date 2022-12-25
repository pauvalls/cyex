document.removeEventListener('click', clicked)
checkInput();


console.log(
`
describe('empty spec', () => {
  it('passes', () => {
      ${commandList.toString().replaceAll(",", "\n")}
  })
})`
)

sessionStorage.setItem("commandList", "")