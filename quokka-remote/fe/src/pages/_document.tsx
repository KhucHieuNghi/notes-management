import { Html, Head, Main, NextScript } from "next/document";

const asd = `(function(d,t) {
  var BASE_URL="https://chatops.stage.cakedigibank.tech";
  var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
  g.src=BASE_URL+"/packs/js/sdk.js";
  g.defer = true;
  g.async = true;
  s.parentNode.insertBefore(g,s);
  g.onload=function(){
    window.chatwootSDK.run({
      websiteToken: 's9qp7ZsN34pmR1mint2tVzkc',
      baseUrl: BASE_URL
    })
  }
})(document,"script");`

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
      <script dangerouslySetInnerHTML={ { __html: asd} }/>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
