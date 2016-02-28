import React from 'react';

export default class Demo extends React.Component {
  
  render() {
    return (
      <div className="container">
        <form className='form-horizontal'>
          <div className='form-group'>
            <label htmlFor='inputEmail3' className='col-sm-2 control-label'>Email</label>
            <div className='col-sm-10'>
              <input type='email' className='form-control' id='inputEmail3' placeholder='Email'/>
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='inputPassword3' className='col-sm-2 control-label'>Password</label>
            <div className='col-sm-10'>
              <input type='password' className='form-control' id='inputPassword3' placeholder='Password'/>
            </div>
          </div>
          <div className='form-group'>
            <div className='col-sm-offset-2 col-sm-10'>
              <div className='checkbox'>
                <label>
                  <input type='checkbox'/> Remember me
                </label>
              </div>
            </div>
          </div>
          <div className='form-group'>
            <div className='col-sm-offset-2 col-sm-10'>
              <button type='submit' className='btn btn-default'>Sign in</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
