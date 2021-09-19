import React from 'react';
import { makeStyles, withTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';

import { AvatarChip, TwoLineLabel, AvatarLogo } from "./AvatarLogo";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  listCss: {
    //paddingTop: theme.spacing(0.5),
    padding:0,

    backgroundColor: "wheat",
    width: "fit-content",
    boxShadow: theme.shadows[3],
    borderRadius: 8,
    overflow: "hidden",
    // "&:hover":{
    //   backgroundColor:"skyblue"
    // }
  },
  listItemCss:{
    paddingLeft:theme.spacing(1),
    paddingRight:theme.spacing(1),
    paddingTop:theme.spacing(0.5),
    paddingBottom:theme.spacing(0.5),
    lineHeight:"100%",


    "&:first-of-type":{
      paddingTop:theme.spacing(1),
    },
    "&:last-of-type":{
      paddingBottom:theme.spacing(1),
    },

    "&:hover":{
      backgroundColor:"#b7e1fc",
      cursor:"pointer",
      
    }

  },
  avatarChipCss: {
    borderRadius: 0,
    backgroundColor: "transparent",
    "&:hover":{
      cursor:"pointer",
    }
    // marginLeft:theme.spacing(0.5),
    // marginRight:theme.spacing(0.5),
    // "&:hover":{
    //   backgroundColor:"skyblue",
    // }
  }


}));

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

export default withTheme(function InteractiveList({ theme, ...props }) {
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

  return (
    <div className={classes.root}>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox checked={dense} onChange={(event) => setDense(event.target.checked)} />
          }
          label="Enable dense"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={secondary}
              onChange={(event) => setSecondary(event.target.checked)}
            />
          }
          label="Enable secondary text"
        />
      </FormGroup>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.title}>
            Text only
          </Typography>
          <div className={classes.demo}>
            <List dense={dense}>
              {generate(
                <ListItem>
                  <ListItemText
                    primary="Single-line item"
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>,
              )}
            </List>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.title}>
            Icon with text
          </Typography>
          <div className={classes.demo}>
            <List dense={dense}>
              {generate(
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Single-line item"
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>,
              )}
            </List>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.title}>
            Avatar with text
          </Typography>
          <div className={classes.demo}>


            <List dense={true} disablePadding={true} className={classes.listCss}>
              <ListItem className={classes.listItemCss} onClick={function () { alert("ffs") }}>
                <AvatarChip personName="fdsf" className={classes.avatarChipCss} lift={0} />
              </ListItem>
              <ListItem className={classes.listItemCss} onClick={function () { alert("ffs") }}>
                <AvatarChip personName="fdsdsdsddsdf" className={classes.avatarChipCss} lift={0} />
              </ListItem>
              <ListItem className={classes.listItemCss} onClick={function () { alert("ffs") }}>
                <AvatarChip personName="fdsddf" className={classes.avatarChipCss} lift={0} />
              </ListItem>

              {/* {generate(
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Single-line item"
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>, 
              )}*/}
            </List>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.title}>
            Avatar with text and icon
          </Typography>
          <div className={classes.demo}>
            <List dense={dense}>
              {generate(
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Single-line item"
                    secondary={secondary ? 'Secondary text' : null}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>,
              )}
            </List>
          </div>
        </Grid>
      </Grid>
    </div>
  );
})