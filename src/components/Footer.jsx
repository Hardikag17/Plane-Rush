import '../styles/Footer.css';

function Footer() {
  return (
    <div className='container-fluid position-fixed bottom-0 start-50 translate-middle-x footer'>
      <div className='row'>
        <div className='col-10'>
          <h4>
            You are the only hope to save the falling plane. Save us PILOT!!
          </h4>
        </div>
        <div className='col-2'>
          <h1 style={{ color: '#242d3c' }}>
            {' '}
            <a
              href='https://github.com/Hardikag17/Plane-Rush'
              className='px-2 text-2xl'>
              <i className='fab fa-github'></i> Plane Rush
            </a>
          </h1>
        </div>
        <center>
          <div className='col-12'>Made with 🖤 by DTech</div>
        </center>
      </div>
    </div>
  );
}

export default Footer;
