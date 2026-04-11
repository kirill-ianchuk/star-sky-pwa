import './App.css'

function App() {
  return (
    <main className="app">
      <header className="app__header">
        <h1>Star Sky</h1>
        <p>Мои ценности и поступки</p>
      </header>

      <section className="sky">
        <div className="sky__placeholder">Небо появится здесь</div>
      </section>

      <footer className="app__footer">
        <button className="primary-button">Добавить звезду</button>
      </footer>
    </main>
  )
}

export default App
