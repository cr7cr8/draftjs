import React,{useState} from "react"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { Avatar, Chip, Popover, Typography, Container, CssBaseline } from "@material-ui/core";
import { makeStyles, styled, useTheme, } from '@material-ui/styles';






const useStyles = makeStyles(function ({ textSizeArr, breakpointsAttribute, multiplyArr, ...theme }) {


  return {

    typoUpCss: () => {

      return {

        lineHeight: "unset",
        ...breakpointsAttribute(
          ["fontSize", ...multiplyArr(textSizeArr, 60 / 100)],
          //    ["marginRight", ...multiplyArr(textSizeArr, 40 / 100)]
        ),

      }
    },
    typoDownCss: () => {

      return {

        lineHeight: "unset",
        ...breakpointsAttribute(
          ["fontSize", ...multiplyArr(textSizeArr, 40 / 100)],
          //   ["marginRight", ...multiplyArr(textSizeArr, 40 / 100)]
        ),



      }
    }


  }



})




export default function DraftEditor() {
  const theme = useTheme()
  const { typoUpCss, typoDownCss } = useStyles()

  const [logoOn,setLogoOn] = useState(true)
  const [labelOn,setLabelOn] = useState(true)

  return (
    <>


      <div><br /></div>


      {/* <AvatarChip
        bgColor="green"
        personName="ss5s"
        label={<><Typography variant="body2">body2回的</Typography>
          <Typography variant="body2">body2回的</Typography></>
        }
        hoverContent={"aaa"}
      />


      <AvatarChip bgColor="pink"
        backgroundColor
        personName="srers5s"
        size="2rem"
        label={<> <Typography variant="body2" style={{ fontSize: "1rem" }}>body2回的</Typography> <Typography variant="body2">body2回的</Typography></>}
        hoverContent={"aaa"}
      />
      <div>&nbsp;</div>*/}

      <AvatarChip bgColor="pink" personName="sdss" />
      <AvatarChip bgColor="lightblue" personName="sdss" label={"dddsdfew"} />
      <AvatarChip bgColor="lightpink" lift={0} labelOn={false} personName="ewe" label={"dddsdfew"}

        avatarProps={{ onClick: function () { alert("ss") } }}

      />


      <AvatarChip bgColor="#959875" lift={0} logoOn={logoOn} labelOn={!logoOn} personName="ewe"
        label={"dddseee就看发大水了dfew"}
       // avatarProps={{ onClick: function () { alert("ss") } }}
        onClick={function(){   setLogoOn(pre=>!pre)   }}
        onDelete={function(){}}
      />


      <AvatarChip personName=""
      bgColor="blue"
      lift={0}
      logoOn={true}
      labelOn={false}
        // label={
        //   <TwoLineLabel lineTop="AAA" lineDown="FDSF" />

        // }
        // label={""}
        
        avatarProps={{ onClick: function (e) { e.stopPropagation(); setLabelOn(pre=>!pre)  } }}

        onClick={function(){   setLogoOn(pre=>!pre)   }}
      //  onDelete={function(){setLabelOn(pre=>!pre) ; setLogoOn(pre=>!pre)   }}
      hoverContent={"aaa"}
      />


      {/* <AvatarChip personName="sdss"
       logoOn={logoOn} labelOn={labelOn}
        label={
          <>
            <Typography color="textPrimary" className={typoUpCss} >阿阿发阿发</Typography>
            <Typography color="textSecondary" className={typoDownCss} >产业客户经经理</Typography>
          </>
        }
        hoverContent={<>fdsfds</>}
        avatarProps={{ onClick: function (e) { e.stopPropagation(); setLogoOn(pre=>!pre)  } }}

        onClick={function(){   setLabelOn(pre=>!pre)   }}
        onDelete={function(){setLogoOn(true)}}
      /> */}




      {/* <Typography variant="body2">dfdsfsffsdfggg</Typography>
      <AvatarLogo size={["4rem", "3rem", "2rem", "4.5rem"]} personName="ffdd" src={"https://picsum.photos/200/300/"} /> 
      <AvatarChip bgColor="#faf" src="https://picsum.photos/200" personName="sssd5sss" />
      <div>&nbsp;</div>
      <AvatarChip bgColor="lightgreen" src="https://picsum.photos/200" personName="ssd5s" label={<><Typography variant="body2">body2回的</Typography>  </>} /> */}


    </>


  )


}