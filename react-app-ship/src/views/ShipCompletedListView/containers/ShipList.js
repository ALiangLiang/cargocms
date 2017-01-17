/* @flow */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  FontIcon,
  AutoComplete,
} from 'material-ui';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Lang from 'lodash';
import ShipCard from './ShipCard';
import '../_style.scss';
import {
  showToast,
  closeToast,
} from '../../../redux/utils/toast';
import {
  fetchShipListData,
  fetchFindShipItem,
} from '../../../redux/modules/shipOrder';

const styles = {
  iconSearch: {
    height: '72px',
    lineHeight: '72px',
    marginRight: 5,
    paddingTop: 10,
    right: '-70%',
    fontSize: 14,
  },
  searchBarContainer: {
    marginRight: 40,
    height: 72,
    verticalAlign: 'middle',
    lineHeight: '72px',
    fontSize: 0,
  },
  cardListContainer: {
    width: '90%',
    margin: '0 auto',
  },
};

@connect(
  state => ({
    shipOrder: state.shipOrder,
    toast: state.toast,
    user: state.user,
  }),
  dispatch => bindActionCreators({
    showToast,
    closeToast,
    fetchShipListData,
    fetchFindShipItem,
  }, dispatch),
) export default class ShipList extends React.Component {
  static defaultProps = {
    shipOrder: {},
    user: {},
    showToast: null,
    closeToast: null,
    fetchShipListData: null,
    fetchFindShipItem: null,
  };

  static propTypes = {
    shipOrder: PropTypes.object,
    user: PropTypes.object,
    showToast: PropTypes.func,
    closeToast: PropTypes.func,
    fetchShipListData: PropTypes.func,
    fetchFindShipItem: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      dataSource: props.shipOrder.list,
      status: 'COMPLETED',
    };
    this.inputDelayer = null;
    this.getDataDelayer = null;
    this.searchTextBuffer = '';
    this.getDataDelayer = () => {
      setTimeout(() => {
        if (!Lang.isEmpty(this.props.user.currentUser.Supplier)) {
          this.props.fetchShipListData(this.state.status);
          clearTimeout(this.getDataDelayer);
        } else {
          this.getDataDelayer();
        }
      }, 1500);
    };
  }

  componentWillMount() {
    this.getDataDelayer();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  componentWillUpdate(nextProps) {
    if (nextProps !== this.props) {
      // check list data equal
      if (nextProps.shipOrder.list !== this.state.dataSource) {
        this.setState({
          dataSource: nextProps.shipOrder.list,
        });
      }
    }
  }

  handleUpdateInput = (searchText) => {
    const nil = Lang.isNil(searchText);
    const empty = Lang.isEmpty(searchText);
    if (nil || empty) {
      clearTimeout(this.inputDelayer);
      this.inputDelayer = null;
      this.props.fetchShipListData(this.state.status);
    }
  }

  handleSearchRequest = (chosenRequest: string, index: number) => {
    this.handleSearch(chosenRequest);
  }

  handleSearch = (searchText) => {
    if (!this.inputDelayer) {
      this.inputDelayer = setTimeout(() => {
        const nil = Lang.isNil(searchText);
        const empty = Lang.isEmpty(searchText);
        if (!nil && !empty) {
          this.props.fetchFindShipItem(searchText, this.state.status);
        } else {
          this.props.fetchShipListData(this.state.status);
        }
        clearTimeout(this.inputDelayer);
        this.inputDelayer = null;
      }, 300);
    }
  }

  render() {
    const dataSource = this.state.dataSource;
    const isNoData = Lang.isEmpty(dataSource);
    const autoCompleteTitle = [];
    if (!isNoData) {
      for (const item of dataSource) {
        if (item.displayName) { autoCompleteTitle.push(item.displayName); }
        if (item.email) { autoCompleteTitle.push(item.email); }
        if (item.telephone) { autoCompleteTitle.push(item.telephone); }
        if (item.paymentAddress1) { autoCompleteTitle.push(item.paymentAddress1); }
        if (item.paymentCity) { autoCompleteTitle.push(item.paymentCity); }
        if (item.invoicePrefix && item.invoiceNo) {
          autoCompleteTitle.push(item.invoicePrefix + item.invoiceNo);
        }
      }
    }
    return (
      <div className='container' >
        <div className='row searchBar' style={styles.searchBarContainer}>
          <div className='col-xs-1'>
            <FontIcon
              className='material-icons'
              style={styles.iconSearch}
            >search</FontIcon>
          </div>
          <div className='col-xs-10'>
            <AutoComplete
              floatingLabelText='輸入關鍵字搜尋出貨記錄'
              filter={AutoComplete.fuzzyFilter}
              dataSource={autoCompleteTitle}
              maxSearchResults={5}
              // hintText='輸入以查詢'
              fullWidth={true}
              onUpdateInput={this.handleUpdateInput}
              onNewRequest={this.handleSearchRequest}
            />
            <div className='col-xs-1'>{}</div>
          </div>
        </div>
        <div className='row' style={styles.cardListContainer}>
          <div className='shipCardSeparater'>{}</div>
          <ReactCSSTransitionGroup
            transitionName='cardlist'
            transitionEnterTimeout={800}
            transitionLeaveTimeout={300}
          >
            {
              !isNoData ?
                dataSource.map(item => (
                  <ShipCard
                    toast={this.props.showToast}
                    key={item.id}
                    {...item}
                  />
                )) : null
            }
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}
