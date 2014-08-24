
/**
 * Stage
 * Author: PerterPon<PerterPon@gmail.com>
 * Create: Mon Aug 18 2014 19:48:47 GMT+0800 (CST)
 */

"use strict"

var config = {
  host : 'http://perterpon.wicp.net'
};

var tableData = null;

$( function() {
  initDomEvent()
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
  var date = moment().format( 'YYYY-MM-DD');
  var host = config.host;
  $.ajax( {
    url : host + '/note/' + date,
    success : function( data ) {
      tableData = data[ 0 ] || {
        notes : []
      };
      drawTable( tableData.notes );
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
      '<tr>\
        <td class="note-checkbox">\
          <input type="checkbox"\
      ';
    var done = data[ i ].done;
    if( 'true' === done ) {
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
  tableData.notes.unshift( {
    content : '',
    done    : 'false'
  } );
  drawTable( tableData.notes );
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
  var $this   = $( this );
  var $tr     = $this.parent().parent();
  var index   = $tr.index();
  var content = $this.text();
  $this.removeAttr( 'contenteditable' );
  tableData.notes[ index ].content = content;
  updateDate();
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
  tableData.notes[ index ].done = this.checked.toString();
  updateDate();
}

/**
 * [updateDate description]
 * @return {[type]} [description]
 */
function updateDate() {
  var date = moment().format( 'YYYY-MM-DD' );
  var host = config.host;
  tableData.date = date;
  tableData.is_delete = 'n';
  $.ajax( {
    url  : host + '/note/' + date,
    type : 'POST',
    data : tableData,
    success : function(){
      loadData();
    }
  } );
}
