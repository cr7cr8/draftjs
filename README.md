  
 ### AvatarChip
      <AvatarChip size={theme.textSizeArr} bgColor="pink" personName="sdss" onDelete={function () { }} /> <br />
      <AvatarChip bgColor="pink" personName="sdss" onDelete={function () { }} /> <br />
      <AvatarChip size={theme.textSizeArr} bgColor="pink" personName="sdss" /> <br />
      <AvatarChip bgColor="pink" personName="sdss" /> <br />
  
      <AvatarChip personName="will"
        bgColor="lightyellow"
        size={theme.textSizeArr}
        labelSize={theme.lgTextSizeArr}
        logoOn={logoOn}
        labelOn={labelOn}
        label={
          <TwoLineLabel lineTop={<>AAA00009999</>} lineDown="FDSFsssssss" />
        }

        src="https://picsum.photos/200"
        avatarProps={{ onClick: function (e) { e.stopPropagation(); setLabelOn(pre => !pre) } }}

        onClick={function (e) { e.stopPropagation(); setLogoOn(pre => !pre) }}
        onDelete={function (e) { e.stopPropagation(); setLabelOn(pre => !pre); setLogoOn(pre => !pre) }}
        hoverContent={"aaa"}
      /><br />
  
  
  
  ### Import
       import { Context } from "./ContextProvider";
        
  ###
        function withContext(Compo) {
          return class BBB extends Component {
            static contextType = Context
            constructor(props, ccc) {
              super(props, ccc)
              console.log(ccc.isLight + "000000000000")
            }

            render() {
              return <Compo {...this.props} ctx={this.context} />
            }
          }
        }


###
        function withContext2(Compo) {
          return class BBB extends Component {

            render() {
              return (
                <Context.Consumer>
                  {state => <Compo {...this.props} ctx={state} />}
                </Context.Consumer>
              )


            }
          }
        }

###
        export function withContext3(Component) {
          return function (props) {
            return (
              <Context.Consumer>
                {state => <Component {...props} ctx={state} />}
              </Context.Consumer>
            );
          };
        }
###
        export function withContext4(Component) {
          return function (props) {
            const ctx = useContext(Context)
            return (
              <Component {...props} ctx={ctx} />
            );
          };
        }
###

        const A = withContext4(function ({ ctx, ...props }) {

          return <h1>{JSON.stringify(ctx.isLight)}</h1>

        })




# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
