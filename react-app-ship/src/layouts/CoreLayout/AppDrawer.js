/* @flow */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {
  AppBar,
  Drawer,
  Snackbar,
} from 'material-ui';
import MainToolbar from './MainToolbar';
import DrawerMenuItems from './DrawerMenuItems';
import {
  showToast,
  closeToast,
} from '../../redux/modules/toast';

const styles = {
  appBar: {
    backgroundColor: '#2D3743',
    fontSize: 12,
  },
  contentContainer: {
    // flex: 1,
    // display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'flex-start',
  },
  drawer: {
    zIndex: 2,
    position: 'fixed',
  },
  drawerContainer: {
    marginTop: 10,
    backgroundColor: '#F2F2F2',
    // position: 'relative',
  },
  content: {
    zIndex: 1,
    paddingLeft: 10,
    position: 'relative',
  },
};

@connect(
  state => ({
    toastMsg: state.toastMsg,
    toastOpen: state.toastOpen,
  }),
  dispatch => bindActionCreators({
    showToast,
    closeToast,
  }, dispatch),
) export default class AppDrawer extends React.Component {
  static propTypes = {
    showToast: PropTypes.func,
    closeToast: PropTypes.func,
    content: PropTypes.object,
    toastMsg: PropTypes.string,
    toastOpen: PropTypes.bool,
  };

  static defaultProps = {
    showToast: null,
    closeToast: null,
    content: '',
    toastMsg: '',
    toastOpen: false,
  };

  constructor(props) {
    super(props);
    injectTapEventPlugin();
    this.state = {
      drawerOpen: true,
      drawerWidth: 200,
      width: 0,
      height: 0,
      // toastOpen: props.toastOpen,
      // toastMsg: props.toastMsg,
    };
  }

  componentWillMount = () => {
    this.updateDimensions();
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps !== this.props) {
      // this.setState({
      //   toastMsg: nextProps.toastMsg,
      //   toastOpen: nextProps.toastOpen,
      // });
    }
    console.log('nextProps==>', nextProps);
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    const w = window;
    const d = document;
    const documentElement = d.documentElement;
    const body = d.getElementsByTagName('body')[0];
    const width = w.innerWidth || documentElement.clientWidth || body.clientWidth;
    const height = w.innerHeight || documentElement.clientHeight || body.clientHeight;
    this.setState({ width, height });
  }

  handleToggle = () => {
    this.props.showToast('!!!!!!!!!!!');
    this.setState({
      drawerOpen: !this.state.drawerOpen,
    });
  };

  render() {
    const isMobile = this.state.width < 768;
    const drawerWidth = this.state.drawerWidth;

    if (this.state.open && !isMobile) {
      styles.content.width = `calc(100% - ${drawerWidth}px)`;
      styles.content.margin = `0px ${drawerWidth}px 0px ${drawerWidth}px`;
    } else {
      styles.content.width = '95%';
      styles.content.margin = '0 auto';
    }
    const zDepth = isMobile ? 2 : 0;
    const titleText = isMobile ? '出貨管理系統' : '雲端漁場出貨管理系統';

    styles.drawerContainer.position = isMobile ? 'fixed' : 'relative';
    console.log('this.props.toastOpen=>', this.props.toastOpen);
    return (
      <div className=''>
        <AppBar
          title={titleText}
          onLeftIconButtonTouchTap={this.handleToggle}
          style={styles.appBar}
        >
          <MainToolbar />
        </AppBar>
        <div className='' style={styles.contentContainer}>
          <Drawer
            style={styles.drawer}
            containerStyle={styles.drawerContainer}
            className='drawer'
            zDepth={zDepth}
            open={this.state.drawerOpen}
            width={this.state.drawerWidth}
            docked={!isMobile}
          >
            <DrawerMenuItems />
          </Drawer>
          <div className='' style={styles.content}>
            {this.props.content}
          </div>
          <Snackbar
            open={this.props.toastOpen}
            message={this.props.toastMsg}
            autoHideDuration={4000}
            onRequestClose={this.props.closeToast}
          />
        </div>
      </div>
    );
  }
}
