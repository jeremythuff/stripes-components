import React from 'react';
<<<<<<< HEAD
import Autosizer from './Autosizer';
import MCLRenderer from './MCLRenderer';

const MultiColumnList = (props) => {

  if(props.autosize){
    return (
      <Autosizer>
        {({ height, width }) =>
          (
            <MCLRenderer {...props} height={height} width={width} />
          )
        }
      </Autosizer>
=======
import PropTypes from 'prop-types';
import * as Table from 'reactabular-table';
import * as Sticky from 'reactabular-sticky';
import * as Virtualized from 'reactabular-virtualized';
import classNames from 'classnames';
import keycodes from 'keycodes';
import Autosizer from './Autosizer';
import Icon from '@folio/stripes-components/lib/Icon';
import css from './MultiColumnList.css';

Virtualized.BodyWrapper.shouldComponentUpdate = true;
Virtualized.BodyRow.shouldComponentUpdate = true;

const propTypes = {
  /** Data object to render */
   contentData: PropTypes.arrayOf(PropTypes.object),
   /** Properties visible in table - order of values also defines order of columns */
   visibleColumns: PropTypes.arrayOf(PropTypes.string),
   /** Data object properties to be included with an onRowClick handler */
   rowMetadata: PropTypes.arrayOf(PropTypes.string),
   /** Data object properties to be included with an onHeaderClick handler */
   headerMetadata: PropTypes.object,
   /** Specific control of rendering data properties - ex, concatenate firstName and lastName properties */
   formatter: PropTypes.objectOf(PropTypes.func),
   /** object with key:value pair for selected row - ex: {'id': '1294'} */
   selectedRow: PropTypes.object,
   /** assign sorted classes to column with this name */
   sortedColumn: PropTypes.string,
   /** nominates a column as the one by which the data are sorted: will be rendered distinctively */
   sortOrder: PropTypes.string,
   /** handler for row clicks */
   onRowClick: PropTypes.func,
   /** handler for header clicks */
   onHeaderClick: PropTypes.func,
   /** override for the default css class for a selected item */
   selectedClass: PropTypes.string,
   sortedClass: PropTypes.string,
   /** override for the default css class for a selected item */
   isEmptyMessage: PropTypes.string,
   /** table caption */
<<<<<<< HEAD
   caption: React.PropTypes.oneOf([React.PropTypes.string, React.PropTypes.element]),
  /** map column names to backend data - affects supplied arguments for onHeaderClick callback - ex: {'username': 'userId}
=======
   caption: PropTypes.oneOf([PropTypes.string, PropTypes.element]),
   /** map column names to backend data - affects supplied arguments for onHeaderClick callback - ex: {'username': 'userId}
>>>>>>> 2f472d2eec8d80c15818709999d2a25a92fb28fd
    * would send 'userId' to the onHeaderClick handler when the header with the name 'username' is clicked.
   */
   columnMapping: PropTypes.object,
   /** supply custom unique prop for item identifier. Defaults to 'id.'*/
   uniqueIdentifier: PropTypes.string,
   /** callback to the application to load additional data and pass the list a new contentData prop */
   onFetch: PropTypes.func
};

const defaultProps = {
  contentData: [],
  selectedClass: css.selected,
  sortedClass: css.sorted,
  onHeaderClick: (e)=>null,
  onRowClick: (e)=>null,
  onFetch: ()=>null,
  isEmptyMessage: "The list contains no items",
  formatter: {},
  columnMapping: {},
  uniqueIdentifier: 'id',
};

class MultiColumnList extends React.Component {
  constructor(props) {
    super(props);

    this.state = ({
      headerHeight: 22,
      minColumnWidth: 200,
      loading: false
    });

    this.tableHeader = null;
    this.tableBody = null;
    this.tableBodyInstance = null;
    this.loadThreshold = 0;

    this.getCellFormatter = this.getCellFormatter.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.onBodyRow = this.onBodyRow.bind(this);
    this.maybeSelected = this.maybeSelected.bind(this);
    this.onBodyScroll = this.onBodyScroll.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount(){
    // initial 'fetch More' threshold set to half of the initial load.
    this.loadThreshold = this.props.contentData.length/2;
    // update now that we have refs.
    this.forceUpdate();
  }

  componentWillReceiveProps(nextProps){
    // at this stage, an update to the length of contentData 
    // is what we have to lean on to know new data has come back...
    if(nextProps.contentData.length > this.props.contentData.length){
      console.log('data received');
      const lengthDelta = nextProps.contentData.length - this.props.contentData.length;
      this.loadThreshold = this.props.contentData.length + (lengthDelta/2);
      this.setState({
        loading: false,
      });
    }
  }

  getRRowClass(row) {
    return classNames(
      css.selectable,
      {
        [`${css.selected}`]: (this.state.selected != null && row.index === this.state.selected.index),
      }
    )
  }

  getSortedClass(){
    return this.props.sorted? this.props.sortedClass : '';
  }

  initColumns(){
    let columns = [];
    for(let header in this.props.contentData[0]){
      const hind = this.props.headerMetadata ? this.props.headerMetadata.indexOf(header) : -1;
      const rind = this.props.rowMetadata ? this.props.rowMetadata.indexOf(header) : -1;
      if(hind === -1 && rind === -1){
        columns.push(header);
      } 
    }
    return columns;
  }

  getMappedPropertyName(label){
    const { columnMapping } = this.props;
    if(columnMapping.hasOwnProperty(name)){
      return columnMapping[name];
    } else {
      return label;
    }
  }

  getCellFormatter(label){
    const { formatter } = this.props;
    if(formatter.hasOwnProperty(label)){
      return [(value, { rowData }) => { return formatter[label](rowData); }];
    } else {
      return undefined;
    }
  }

  handleRowClick(e, row, rowMeta){
    let meta = {};
    if(this.props.rowMetadata){
      this.props.rowMetadata.forEach(function(prop){
        meta[prop] = row[prop];
      }, this);
    }
    this.props.onRowClick(e, meta);
  }

  maybeSelected(criteria, row){
    let selected = criteria && Object.keys(criteria).length > 0;
    for(let prop in criteria){
      if(criteria[prop] !== row[prop]){
        selected = false;
      }
    }
    return selected? this.props.selectedClass : '';
  }

  handleKeyPress(e, row, rowMeta){
    switch(keycodes(e.keyCode)){
      case 'enter':
        this.handleRowClick(e, row, rowMeta);
        break;
    }
  }

  onBodyRow(row, rowMeta ) {
    return {
      onClick: (e) => {this.handleRowClick(e, row, rowMeta);},
      className: this.maybeSelected(this.props.selectedRow, row),
      tabIndex: 0,
      onKeyDown: (e) => {this.handleKeyPress(e, row, rowMeta);},
    };
  }

  getHeaderClassName(column){
    if(this.props.sortedColumn == column.property){
      return css.sorted;
    }
    return '';
  }

  handleHeaderClick(e, name){
    const alias = this.props.columnMapping[name] || name;
    let meta = {name, alias};
    if(this.props.headerMetadata){
      for(let prop in this.props.headerMetadata[columnName]){
        meta[prop] = this.props.headerMetadata[columnName][prop];
      }
    }
    this.props.onHeaderClick(e, meta);
  }

  onBodyScroll({ target: { scrollHeight, scrollTop, offsetHeight } }) {
  //if an onFetch handler has been supplied, account for visible rows and see if we need to load more items.
   if(this.props.onFetch && this.state.loading === false){
     //startIndex, amountOfRowsToRender are held/controlled by the Virtualized.Body component.
    const { startIndex, amountOfRowsToRender } = this.tableBodyInstance.state;
      if ((startIndex + amountOfRowsToRender) > this.loadThreshold){
        //call the onFetch call back so the application fetches more data for us to render...
        console.log('asking for more data...')
        this.props.onFetch();
        //set loading state... when array comes back it will update props and set the loading state to false.
        this.setState({
          loading: true
        });
      }
    }
  }

  render() {

    const {
      contentData,
<<<<<<< HEAD
      visibleColumns,
      rowMetadata,
      headerMetadata,
      formatter,
      selectedRow,
      sortedColumn,
      sortOrder,
      onRowClick,
      onHeaderClick,
      selectedClass,
      sortedClass,
      isEmptyMessage,
      fullWidth,
      columnMapping,
      onFetch,
      ...tableProps
=======
      uniqueIdentifier,
      visibleColumns
>>>>>>> 2f472d2eec8d80c15818709999d2a25a92fb28fd
    } = this.props;

    //if contentData is empty, render empty message...
    if(contentData.length === 0){
      return <div>{this.props.isEmptyMessage}</div>;
    }
    
    //if no visibleColumns prop specified, build columns from object...
    let columns = visibleColumns? visibleColumns : this.initColumns();

    //Generate column configurations...
    const renderedColumns = [];
    columns.forEach((header, i) => {
      renderedColumns.push({
        property: this.getMappedPropertyName(header),
        props: {
          style: { minWidth: this.state.minColumnWidth}
        },
        header: {
          label: header,
          transforms: [
            (header, {columnIndex, column} ) => ({
              onClick: (e) => this.handleHeaderClick(e, header),
              className: this.getHeaderClassName(column),
            }),
          ],
        },
        cell: { 
          formatters: this.getCellFormatter(header),
        }
      });
    });
     
    return (
      <div style={{width: '100%', height: '100%'}}>
        <Autosizer>
          {({ height, width }) => (
            <Table.Provider
              columns={renderedColumns}
              className={css.multilist}
              components={{
                body: {
                  wrapper: Virtualized.BodyWrapper,
                  row: Virtualized.BodyRow,
                }
              }}
            >
              <Sticky.Header
                style={{
                  maxWidth: width
                }}
                ref={tableHeader => {
                  this.tableHeader = tableHeader && tableHeader.getRef();
                }}
                tableBody={this.tableBody}
              />
              <Virtualized.Body
                rows={contentData}
                rowKey={uniqueIdentifier}
                onRow={this.onBodyRow}
                height={height-46} //get dynamic width
                style={{
                  maxWidth: width,
                }}
                ref={tableBody => {
                  this.tableBody = tableBody && tableBody.getRef();
                  this.tableBodyInstance = tableBody;
                }}
                tableHeader={this.tableHeader}
                onScroll={this.onBodyScroll}
              />
            </Table.Provider>
          )}
        </Autosizer>
        <div className={css.overlayContainer}>
          {this.state.loading && 
            <div className={css.contentLoading} style={{}}>
              <Icon icon='spinner-ellipsis' />
            </div>
          }
        </div>
      </div>
>>>>>>> origin/InfiniteScroll
    )
  }

  return <MCLRenderer {...props} />;
}

export default MultiColumnList;