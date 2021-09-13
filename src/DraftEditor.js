import React, { useState } from "react"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { Avatar, Chip, Popover, Typography, Container, CssBaseline } from "@material-ui/core";
import { makeStyles, styled, useTheme, } from '@material-ui/styles';

import { withContext1 } from "./ContextProvider"




export default withContext1(function DraftEditor({ ctx, ...props }) {
  //const theme = useTheme()
  // const { typoUpCss, typoDownCss } = useStyles()


  const theme = ctx.theme

  const [logoOn, setLogoOn] = useState(true)
  const [labelOn, setLabelOn] = useState(true)

  return (
    <>




      <AvatarChip size={theme.textSizeArr} bgColor="pink" personName="" onDelete={function () { }} /> <br />
      <AvatarChip bgColor="pink" personName="sdss" onDelete={function () { }} /> <br />
      <AvatarChip size={theme.textSizeArr} bgColor="pink" label={<strong>ieowuei</strong>} /> <br />
      <AvatarChip
        size="6.5rem"
        labelSize="1rem"
        logoOn={logoOn}
        labelOn={labelOn}
        onDelete={function () { }}

        bgColor="pink" personName="就看了sds看了反倒是s" /> <br />
      <AvatarChip
        size="6.5rem"
        labelSize="5rem"
        logoOn={logoOn}
        labelOn={labelOn}
        onDelete={function () { }}

        bgColor="pink" personName="就看了sds看了反倒是s" /> <br />



      <AvatarChip personName="will"
        // bgColor="orange"
        size={theme.lgTextSizeArr}
        labelSize={theme.textSizeArr}
        logoOn={logoOn}
        labelOn={labelOn}
        label={
          <TwoLineLabel lineTop={"毛噶飞"} lineDown="银行经理" />
        }

        //   src="https://picsum.photos/200"
        avatarProps={{ onClick: function (e) { e.stopPropagation(); setLabelOn(pre => !pre) } }}

        onClick={function (e) { e.stopPropagation(); setLogoOn(pre => !pre) }}
        onDelete={function (e) { e.stopPropagation(); setLabelOn(pre => !pre); setLogoOn(pre => !pre) }}
        hoverContent={"aaa"}
      /><br />

      <AvatarChip personName="will"
        //  bgColor="lightpink"
        size={theme.multiplyArr(theme.textSizeArr, 2.6)}
        labelSize={theme.multiplyArr(theme.textSizeArr, 2)}
        logoOn={logoOn}
        labelOn={labelOn}
        label={
          <TwoLineLabel lineTop={"毛噶飞"} lineDown="银行经理" />
        }

        src="https://picsum.photos/200"
        avatarProps={{ onClick: function (e) { e.stopPropagation(); setLabelOn(pre => !pre) } }}

        onClick={function (e) { e.stopPropagation(); setLogoOn(pre => !pre) }}
        onDelete={function (e) { e.stopPropagation(); setLabelOn(pre => !pre); setLogoOn(pre => !pre) }}
        hoverContent={"aaa"}
      /><br />

      <AvatarChip personName="will"
        //  bgColor="lightpink"
        size={theme.multiplyArr(theme.textSizeArr, 2.6)}
        labelSize={theme.multiplyArr(theme.textSizeArr, 2)}
        logoOn={logoOn}
        labelOn={labelOn}
        label={
          <TwoLineLabel lineTop={"毛噶飞"} lineDown="银行经理" />
        }

        src="https://picsum.photos/200"
        avatarProps={{ onClick: function (e) { e.stopPropagation(); setLabelOn(pre => !pre) } }}

        onClick={function (e) { e.stopPropagation(); setLogoOn(pre => !pre) }}
        //     onDelete={function (e) { e.stopPropagation(); setLabelOn(pre => !pre); setLogoOn(pre => !pre) }}
        hoverContent={"aaa"}
      /><br />

      <AvatarChip personName="will"
        bgColor="lightyellow"

        logoOn={logoOn}
        labelOn={labelOn}
        label={
          <TwoLineLabel lineTop={<>AAA00009999</>} lineDown="FDSFsssssss" />
        }

        // src="https://picsum.photos/200"
        avatarProps={{ onClick: function (e) { e.stopPropagation(); setLabelOn(pre => !pre) } }}

        onClick={function (e) { e.stopPropagation(); setLogoOn(pre => !pre) }}
        //  onDelete={function (e) { e.stopPropagation(); setLabelOn(pre => !pre); setLogoOn(pre => !pre) }}
        hoverContent={"aaa"}
      /><br />

      <AvatarChip personName="will"
        bgColor="lightyellow"
        size={theme.textSizeArr}

        logoOn={logoOn}
        labelOn={labelOn}
        label={
          <TwoLineLabel lineTop={<>AAA00009999</>} lineDown="FDSFsssssss" />
        }

        // src="https://picsum.photos/200"
        avatarProps={{ onClick: function (e) { e.stopPropagation(); setLabelOn(pre => !pre) } }}

        onClick={function (e) { e.stopPropagation(); setLogoOn(pre => !pre) }}

        hoverContent={"aaa"}
      /><br />

      <AvatarChip personName="will"
        bgColor="lightyellow"

        logoOn={logoOn}
        labelOn={labelOn}
        label={
          <TwoLineLabel lineTop={<>AAA00009999</>} lineDown="FDSFsssssss" />
        }

        // src="https://picsum.photos/200"
        avatarProps={{ onClick: function (e) { e.stopPropagation(); setLabelOn(pre => !pre) } }}

        onClick={function (e) { e.stopPropagation(); setLogoOn(pre => !pre) }}

        hoverContent={"aaa"}
      /><br />




      <AvatarChip bgColor="lightblue" personName="sdssf" label={"dddsd了就看发大"} size="11.7rem" labelSize="9rem"
        onDelete={function () { }}
      />
      <AvatarChip bgColor="lightpink" lift={0} labelOn={false} personName="ewe" label={"dddsdfew"}

        avatarProps={{ onClick: function () { alert("ss") } }}

      />
      <br />
      <AvatarChip size="8rem" labelSize={["1rem", "2rem", "10rem", "56px"]} bgColor="#599875" lift={0} logoOn={logoOn}
        labelOn={labelOn} personName="ewe"
        label={<b>红看来大家分离开了就看发大水了</b>}

        onClick={function () { setLogoOn(pre => !pre) }}
      //  onDelete={function () { }}
      />

      <br />
      <AvatarChip size={["1.3rem", "2.6rem", "3.9rem", "5.2rem", "6.5rem"]} labelSize={["1rem", "2rem", "3rem", "4rem", "5rem"]}
        bgColor="#959875" lift={0} logoOn={true} labelOn={true} personName="ewe"
        label={"dddseee就看发大水了dfewFDSFS"}

        onClick={function () { setLogoOn(pre => !pre) }}
        onDelete={function () { }}
        labelOn={false}
      />
      <br />

      <AvatarChip personName="d"
        // bgColor="blue"
        // size="5.5rem"
        lift={0}
        logoOn={true}
        labelOn={true}
        size="1.5rem"
        label={
          <TwoLineLabel lineTop="textArrSize" lineDown="FDSFsssssss" />

        }


        avatarProps={{ onClick: function (e) { e.stopPropagation(); setLabelOn(pre => !pre) } }}

        onClick={function () { setLogoOn(pre => !pre) }}
        //  onDelete={function(){setLabelOn(pre=>!pre) ; setLogoOn(pre=>!pre)   }}
        hoverContent={"aaa"}
      />
      <br />
      <AvatarChip personName="will"
        bgColor="lightyellow"
        //  size={["15rem", "4rem", "3rem", "2rem", "12rem"]}
        size={theme.textSizeArr}
        lift={9}
        logoOn={logoOn}
        labelOn={labelOn}
        //   labelSize={["15rem", "4rem", "3rem", "2rem", "11rem"]}
        label={
          <TwoLineLabel lineTop={<>AAA00009999</>} lineDown="FDSFsssssss" />

        }

        // src="https://picsum.photos/200"
        avatarProps={{ onClick: function (e) { e.stopPropagation(); setLabelOn(pre => !pre) } }}

        onClick={function (e) { e.stopPropagation(); setLogoOn(pre => !pre) }}
        onDelete={function (e) { e.stopPropagation(); setLabelOn(pre => !pre); setLogoOn(pre => !pre) }}
        hoverContent={"aaa"}
      />





    </>


  )


})