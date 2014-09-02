
/**
 * Stage
 * Author: PerterPon<PerterPon@gmail.com>
 * Create: Mon Aug 18 2014 19:48:47 GMT+0800 (CST)
 */

"use strict"

var config = {
  host : 'http://121.40.160.64:8000'
};

var tableData = null;

$( function() {
  initDomEvent();
  loadData();
} );

/**
 * [initDomEvent description]
 * @return {[type]} [description]
 */
function initDomEvent() {
  $( '.add-btn' ).on( 'click', onAddBtnClick );
  $( 'table' ).on( 'focus', '.note-content', onContentFocus )
    .on( 'blur', '.note-content', onContentBulr )
    .on( 'change', 'input[type=checkbox]', onCheckChange )
}

/**
 * [loadData description]
 * @return {[type]} [description]
 */
function loadData () {
  var host = config.host;
  var date = moment().format( 'YYYY-MM-DD' );
  $.ajax( {
    url : host + '/note/' + date,
    success : function( data ) {
      tableData = data;
      drawTable( tableData );
    }
  } );
}

/**
 * [drawTable description]
 * @return {[type]} [description]
 */
function drawTable ( data ) {
  if( !data || !Array.isArray( data ) ) {
    return;
  }
  var i, l;
  var $tbody = $( '<tbody></tbody>' );
  var $tr    = null;
  for( i = 0, l = data.length; i < l; i ++ ) {
    $tr  =
      '<tr data-id="'+ data[ i ].id +'">\
        <td class="note-checkbox">\
          <input type="checkbox"\
      ';
    var done = data[ i ].done;
    if( 'y' === done ) {
      $tr += ' checked';
    }
    $tr +=
      ' </td>\
        <td>\
          <div tabindex="0" class="note-content">\
      ';
    $tr += data[ i ].content;
    $tr +=
      '   </div>\
        </td>\
        </tr>\
      ';
    $tr  = $( $tr );
    $tbody.append( $tr );
  }
  $( 'table' ).html( $tbody );
}

/**
 * [onAddBtnClick description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function onAddBtnClick ( event ) {
  event.preventDefault();
  $.ajax( {
    url  : config.host + '/note',
    type : 'POST',
    data : {
      content : '',
      done    : 'n'
    },
    success : function () {
      loadData(); 
    }
  } );
}

/**
 * [onContentFocus description]
 * @return {[type]} [description]
 */
function onContentFocus( event ) {
  var $this   = $( this );
  var $tr     = $this.parent();
  var content = $this.text().trim();
  $this.attr( 'contenteditable', 'true' );
}

/**
 * [onContentBulr description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function onContentBulr( event ) {
  var $this    = $( this );
  var $tr      = $this.parent().parent();
  var index    = $tr.index();
  var content  = $this.text();
  var id       = $tr.data( 'id' );
  $this.removeAttr( 'contenteditable' );
  var item     = tableData[ index ];
  item.content = content;
  updateDate( item );
}

/**
 * [onCheckChange description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function onCheckChange( event ) {
  var $this = $( this );
  var $tr   = $this.parent().parent();
  var index = $tr.index();
  var item  = tableData[ index ];
  item.done = this.checked ? 'y' : 'n';
  updateDate( item );
}

/**
 * [updateDate description]
 * @return {[type]} [description]
 */
function updateDate( data ) {
  var id   = data.id;
  var date = moment().format( 'YYYY-MM-DD' );
  var host = config.host;
  $.ajax( {
    url  : host + '/note/' + id,
    type : 'PUT',
    data : data,
    success : function(){
      loadData();
    }
  } );
}
