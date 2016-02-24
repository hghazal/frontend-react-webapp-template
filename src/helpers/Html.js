import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object,
  };

  render() {
    const { assets, component, store } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    const head = Helmet.rewind();

    return (
      <html lang='en-us'>
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}

          <link href='/favicon.ico' rel='shortcut icon' />
          <meta content='width=device-width, initial-scale=1' name='viewport' />
          {/* styles (will be present only in production with webpack extract text plugin) */}
          { Object.keys(assets.styles).map((style, key) =>
            <link charSet='UTF-8'
                  href={assets.styles[style]}
                  key={key} media='screen, projection'
                  rel='stylesheet'
                  type='text/css' />
          )}
          {/* (will be present only in development mode) */}
          {/* outputs a <style/> tag with all bootstrap styles + App.scss + it could be CurrentPage.scss. */}
          {/* can smoothen the initial style flash (flicker) on page load in development mode. */}
          {/* ideally one could also include here the style for the current page (Home.scss, About.scss, etc) */}
          {/* { Object.keys(assets.styles).length === 0 ? <style dangerouslySetInnerHTML={{__html: require('../theme/bootstrap.config.js') + require('../containers/App/App.scss')._style}}/> : null } */}
        </head>
        <body>
          <div dangerouslySetInnerHTML={{ __html: content }} id='reactAppRoot' />
          <script  charSet='UTF-8' dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }} />
          { Object.keys(assets.javascript).map((script, key) =>
              <script charSet='UTF-8' key={key} src={assets.javascript[script]} />
          )}
        </body>
      </html>
    );
  }
}
