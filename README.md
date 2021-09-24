### Dev9

### EmojiPlugin is done in this branch
Use built-in pain text as emoji, no pictures 

### MentionPlugin is done in this branch
Render mention hint function ?

### import
      import styled from 'styled-components'
      import { Context, withContext1, withContext2, withContext3, withContext4 } from "./ContextProvider";


### define TwoLineLabel_ class
      class TwoLineLabel_ extends Component {

          static contextType = Context
          static defaultProps = {  }
          constructor(props, ctx) {
            super(props, ctx)
          }
          render() {
            const { lineTop, lineDown, className, theme, ...props } = this.props
            const { typoUpCss, typoDownCss } = this.props.classes

            const allClassNamesTop = classNames({
              [typoUpCss]: true,
              [className]: true
            })
            const allClassNamesDown = classNames({
              [typoDownCss]: true,
              [className]: true
            })
            return (
              <>
                <Typography color="textPrimary" className={allClassNamesTop} >{lineTop}</Typography>
                <Typography color="textSecondary" className={allClassNamesDown} >{lineDown}</Typography>
              </>
            )
          }

        }  
  
  
### define styled component first to receive all the passed-down props from the hoc 

           export const TwoLineLabelWithStyled = styled(TwoLineLabel_).withConfig({
              shouldForwardProp: (propName, defaultValidatorFn) => {
                //filter the prop to pass down to the bottom component
                 return propName.indexOf("ctx") !== 0
              }
           })`
              ${ (props) => {
                console.log(props) //pring all the received props, even if it gets filted later

                const { theme: { textSizeArr, breakpointsAttribute, multiplyArr }, logoOn, labelOn, size, cssStyle} = props

                const size_ = Array.isArray(size)
                  ? size
                  : typeof (size) === "string"
                    ? [size]
                    : textSizeArr
                return {
                  ...cssStyle
                 // backgroundColor:"yellow"
                  // ...breakpointsAttribute(
                  //   ((!logoOn) && labelOn) ? ["marginLeft", multiplyArr(size_, 0 / 100)] : []// not updating with props updating logoOn labelOn
                  // ),
                }
              }} 
            `

### first wrap gose to most inside
            export const TwoLineLabel = withContext4(withContext3(withContext2(withContext1((withStyles(styleObj, { withTheme: true })(TwoLineLabelWithStyled))))))
  
  //////////////////////////// dev4
  
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




