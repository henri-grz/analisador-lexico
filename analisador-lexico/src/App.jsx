import { useMemo, useState } from 'react'
import './App.css'

function App() {
  const [newWord, setNewWord] = useState('')
  const [searchWord, setSearchWord] = useState('')
  const [words, setWords] = useState([])
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [searchResult, setSearchResult] = useState('')

  const headers = [
    '-',
    'a','b','c','d','e','f','g','h','i','j','k','l','m',
    'n','o','p','q','r','s','t','u','v','w','x','y','z'
  ]
  const alphabet = headers.slice(1)

  const sanitize = (s) => (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '')

  const handleAddWord = () => {
    const w = sanitize(newWord)
    if (!w) return
    setWords((prev) => [...prev, w])
    setNewWord('')
  }

  const handleRemoveWord = (index) => {
    setWords((prev) => prev.filter((_, i) => i !== index))
    setHoveredIndex(null)
  }

  const handleSearch = () => {
    const w = sanitize(searchWord)
    let state = 0
    for (const ch of w) {
      const to = automaton.trans[state]?.[ch]
      if (to == null) { state = -1; break }
      state = to
    }
    if (state >= 0 && automaton.states[state]?.accept) {
      setSearchResult(`"${w}" é aceita pelo autômato.`)
    } else {
      setSearchResult(`"${w}" NÃO é aceita pelo autômato.`)
    }
  }
  

  // Constrói Automato
  const automaton = useMemo(() => {
    const states = [{ label: 'q0', accept: false }]
    const trans = [Object.create(null)]
    const prefixToIndex = new Map()
    prefixToIndex.set('', 0)

    for (const word of words) {
      let prefix = ''
      let from = 0
      for (const ch of word) {
        const nextPrefix = prefix + ch
        if (!prefixToIndex.has(nextPrefix)) {
          const idx = states.length
          states.push({ label: `q${idx}`, accept: false })
          trans.push(Object.create(null))
          prefixToIndex.set(nextPrefix, idx)
          trans[from][ch] = idx
        } else {
          const to = prefixToIndex.get(nextPrefix)
          trans[from][ch] = to
        }
        prefix = nextPrefix
        from = prefixToIndex.get(prefix)
      }
      states[from].accept = true
    }
    return { states, trans }
  }, [words])

  // Caminha no autômato com a palavra digitada e retorna o estado atual (ou -1 se travou)
  const computeCurrentState = (w) => {
    const s = sanitize(w)
    if (!s) return 0 // vazio: estamos em q0
    let state = 0
    for (const ch of s) {
      const next = automaton.trans[state]?.[ch]
      if (next == null) return -1 // estado nulo (quebrou)
      state = next
    }
    return state
  }

  const currentState = useMemo(() => computeCurrentState(searchWord), [searchWord, automaton])

  return (
    <>
      <div className='justify-center items-start flex flex-col gap-4 m-10'>
        <p className='font-bold text-2xl'>Analisador Léxico</p>
      </div>

      <div className='justify-center items-center flex flex-col gap-10 m-10'>
        <div className='flex w-full flex-col gap-4 md:flex-row md:items-stretch'>
          <div className='flex flex-1 basis-0 flex-col justify-center gap-2 border rounded-md p-10'>
            <label className='font-semibold'>Nova palavra:</label>
            <textarea
              className='border-2 border-gray-300 rounded-md p-2 w-full h-12 resize-none'
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
            />
            <button
              className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-2/6 cursor-pointer'
              onClick={handleAddWord}
            >
              Adicionar
            </button>

            <div className='mt-4 gap-2 flex flex-wrap'>
              {words.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className='bg-green-300 text-slate-800 font-medium rounded-md px-3 py-1 inline-flex items-center gap-2 cursor-default'
                >
                  {word}
                  <button
                    onClick={() => handleRemoveWord(index)}
                    className={`text-red-700 font-bold transition-opacity ${
                      hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                    }`}
                    title='Remover'
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className='flex flex-1 basis-0 flex-col gap-2 border rounded-md p-10'>
            <label className='font-semibold'>Buscar Palavra (tempo real):</label>
            <textarea
              className='border-2 border-gray-300 rounded-md p-2 w-full h-12 resize-none'
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === ' ') {
                  console.log('Espaço pressionado - buscando...')
                  e.preventDefault()
                  handleSearch()
                }
              }}
              placeholder='Digite para ver o caminho no AFD...'
            />
            <button
              className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-2/6 cursor-pointer'
              onClick={handleSearch}
            >
              Buscar
            </button>

            {searchResult && (
              <p
                className={`mt-3 font-semibold ${
                  searchResult.includes('NÃO') ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {searchResult}
              </p>
            )}
          </div>
        </div>

        <div className='w-full flex justify-center px-4'>
          <div className='table-wrapper w-full max-w-5xl overflow-x-auto'>
            <table className='lex-table table-fixed border-collapse border border-gray-400 w-full text-sm md:text-base'>
              <thead id='thead'>
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header}
                      className='border border-gray-300 px-2 py-1 text-center uppercase tracking-wide bg-gray-50'
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody id='tbody'>
                {/* Estados reais */}
                {(automaton.states.length > 0 ? automaton.states : [{label:'q0', accept:false}]).map((st, i) => {
                  const isActive = i === currentState && currentState >= 0
                  return (
                    <tr
                      key={i}
                      className={`odd:bg-white even:bg-gray-50 transition-colors ${
                        isActive ? 'bg-green-100' : ''
                      }`}
                      style={isActive ? { outline: '2px solid #16a34a' } : undefined}
                    >
                      <td className='border border-gray-300 px-2 py-1 text-center font-semibold'>
                        {st.accept ? `*${st.label}` : st.label}
                      </td>
                      {alphabet.map((ch) => {
                        const next = automaton.trans[i]?.[ch]
                        return (
                          <td key={ch} className='border border-gray-300 px-2 py-1 text-center'>
                            {next == null ? '-' : `q${next}`}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}

                {/* Linha de estado nulo (∅) quando quebra durante a digitação */}
                {sanitize(searchWord).length > 0 && currentState === -1 && (
                  <tr
                    className='bg-red-100'
                    style={{ outline: '2px solid #dc2626' }}
                  >
                    <td className='border border-gray-300 px-2 py-1 text-center font-semibold'>
                      ∅
                    </td>
                    {alphabet.map((ch) => (
                      <td key={ch} className='border border-gray-300 px-2 py-1 text-center'>-</td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>

            <div className='text-xs text-gray-600 mt-2'>
              <span className='inline-block px-2 py-1 bg-green-100 border border-green-600 rounded mr-2' />
              Estado atual durante a digitação
              <span className='inline-block ml-4 px-2 py-1 bg-red-100 border border-red-600 rounded mr-2' />
              Caminho inválido (estado nulo ∅)
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
