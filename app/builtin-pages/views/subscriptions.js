import * as yo from 'yo-yo'
import { niceDate } from '../../lib/time'
import { ucfirst } from '../../lib/strings'
import prettyBytes from 'pretty-bytes'
import emitStream from 'emit-stream'

// globals
// =

// list of archives
var archives = []

// currently-selected archive index
var selectedArchiveIndex = -1

// currently-selected archive's info
var selectedArchiveInfo

// event emitter
var archivesEvents


// exported API
// =

export function setup () {  
  // start event stream and register events
  archivesEvents = emitStream(beaker.dat.archivesEventStream())
  archivesEvents.on('update-archive', onUpdateArchive)
}

export function show () {
  // fetch archives
  beaker.dat.archives((err, list) => {
    archives = list
    console.log(archives)
    render()
  })

  // TODO
}

export function hide () {
  archives = null
}

// internal methods
// =

function selectArchive (archiveIndex) {
  // update selection and render change
  selectedArchiveIndex = archiveIndex
  selectedArchiveInfo = null
  render()

  // fetch archive info
  var archive = archives[archiveIndex]
  beaker.dat.archiveInfo(archive.key, (err, info) => {
    if (err)
      console.warn(err)
    selectedArchiveInfo = info
    render()
  })
}

// rendering
// =

function render () {
  // render view
  yo.update(document.querySelector('#el-content'), yo`<div class="pane" id="el-content">
    <div style="padding: 10px; background: yellow; border: 1px solid; color: #775618"><span class="icon icon-attention"></span> This page is a placeholder. It has not been implemented yet.</div>
    <div class="subscriptions">

      <div class="feed">

        <div class="feed-entry">
          <div>
            <img class="favicon" src=${'beaker-favicon:https://news.ycombinator.com'} />
            <a class="fe-site" href="#">Hacker News</a>
            v1.0.0
            <a class="fe-date" href="#">July 5</a>
          </div>
          <div class="fe-message">Sprockets are now sleeker and faster.</div>
        </div>

        <div class="feed-entry">
          <div>
            <img class="favicon" src=${'beaker-favicon:https://www.reddit.com'} />
            <a class="fe-site" href="#">Reddit</a>
            v5.2.1
            <a class="fe-date" href="#">July 2</a>
          </div>
          <div class="fe-message">Reactor coils no longer drop their voltage during a power surge.</div>
        </div>

        <div class="feed-entry">
          <div>
            <img class="favicon" src=${'beaker-favicon:https://www.reddit.com'} />
            <a class="fe-site" href="#">Reddit</a>
            v5.2.0
            <a class="fe-date" href="#">July 2</a>
          </div>
          <div class="fe-message">Added more varieties of reactor coil.</div>
        </div>

        <div class="feed-entry">
          <div>
            <img class="favicon" src=${'beaker-favicon:https://imgur.com'} />
            <a class="fe-site" href="#">Imgur</a>
            v3.0.1
            <a class="fe-date" href="#">July 1</a>
          </div>
          <div class="fe-message">Killer monkeys no longer attack their owners, in most cases.</div>
        </div>

      </div>

      <div class="list">
        <a href="#">
          <img class="favicon" src=${'beaker-favicon:https://news.ycombinator.com'} />
          Hacker News
        </a>
        <a href="#">
          <img class="favicon" src=${'beaker-favicon:https://imgur.com'} />
          Imgur
        </a>
        <a href="#">
          <img class="favicon" src=${'beaker-favicon:https://www.reddit.com'} />
          Reddit
        </a>
      </div>
    </div>
  </div>`)
}

// event handlers
// =

function onClick (archiveIndex) {
  return e => selectArchive(archiveIndex)
}

function onUpdateArchive (update) {
  console.log('update', update)
  if (archives) {
    // find the archive being updated
    var archive = archives.find(a => a.key == update.key)
    if (archive) {
      // patch the archive
      for (var k in update)
        archive[k] = update[k]
    } else {
      // add to list
      archives.push(update)
    }
    render()
  }
}