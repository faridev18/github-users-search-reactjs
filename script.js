const render = ReactDOM.render;
const Redux = window.Redux;
const Provider = ReactRedux.Provider;
const createStore = Redux.createStore;
const applyMiddleware = Redux.applyMiddleware;
const combineReducers = Redux.combineReducers;
const bindActionCreators = Redux.bindActionCreators;
const compose = Redux.compose;
const ReduxThunk = window.ReduxThunk.default;
const Component = React.Component;
const PropTypes = React.PropTypes;
const connect = ReactRedux.connect;
const classnames = window.classNames;
const Router = window.ReactRouter.Router;
const Route = window.ReactRouter.Route;
const hashHistory = window.ReactRouter.hashHistory;
const Link = window.ReactRouter.Link;
const syncHistoryWithStore = window.ReactRouterRedux.syncHistoryWithStore;
const routerReducer = window.ReactRouterRedux.routerReducer;
const routerMiddleware = window.ReactRouterRedux.routerMiddleware;
const push = window.ReactRouterRedux.push;
const S = window.S;
const SEARCH_REQUEST = 'SEARCH_REQUEST';
const SEARCH_FAILED = 'SEARCH_FAILED';
const SEARCH_SUCCESS = 'SEARCH_SUCCESS';

const USER_REQUEST = 'USER_REQUEST';
const USER_FAILED = 'USER_FAILED';
const USER_SUCCESS = 'USER_SUCCESS';

const INPUT_QUERY = 'INPUT_QUERY';
const TOGGLE_USER_DETAILS_PAYLOAD = 'TOGGLE_USER_DETAILS_PAYLOAD';



function search(state = {
  results: [],
  query: '',
  fetching: false,
  failure: false },
action) {
  switch (action.type) {
    case SEARCH_REQUEST:
      return Object.assign({}, state, {
        fetching: true,
        failure: false,
        results: [] });

    case SEARCH_FAILED:
      return Object.assign({}, state, {
        fetching: false,
        failure: true,
        results: [] });

    case SEARCH_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        failure: false,
        results: action.results });

    case INPUT_QUERY:
      return Object.assign({}, state, {
        query: action.query });

    default:
      return state;}

}

function user(state = {
  fetchingUser: false,
  failureUser: false,
  userDetails: {},
  showFullDetailsPayload: false },
action) {
  switch (action.type) {
    case TOGGLE_USER_DETAILS_PAYLOAD:
      return Object.assign({}, state, {
        showFullDetailsPayload: !state.showFullDetailsPayload });

    case USER_REQUEST:
      return Object.assign({}, state, {
        fetchingUser: true,
        failureUser: false,
        userDetails: {},
        showFullDetailsPayload: false });

    case USER_FAILED:
      return Object.assign({}, state, {
        fetchingUser: false,
        failureUser: true,
        userDetails: {},
        showFullDetailsPayload: false });

    case USER_SUCCESS:
      return Object.assign({}, state, {
        fetchingUser: false,
        failureUser: false,
        userDetails: action.userDetails,
        showFullDetailsPayload: false });

    default:
      return state;}

}


function toggleUserDetailsPayloadView() {
  return {
    type: TOGGLE_USER_DETAILS_PAYLOAD };

}

function requestList() {
  return {
    type: SEARCH_REQUEST };

}

function receiveList(list) {
  return {
    type: SEARCH_SUCCESS,
    results: list };


}

function errorList(data) {
  return {
    type: SEARCH_FAILED };

}


function requestUser() {
  return {
    type: USER_REQUEST };

}

function receiveUser(userDetails) {
  return {
    type: USER_SUCCESS,
    userDetails: userDetails };


}

function errorUser(data) {
  return {
    type: USER_FAILED };

}

function inputQuery(query) {
  return {
    type: INPUT_QUERY,
    query };

}

// async action to fetch quote
function fetchList() {
  return (dispatch, getState) => {
    const { query } = getState().search;

    dispatch(requestList());

    fetch('https://api.github.com/search/users?q=' + query, {
      method: 'get' }).


    then(function (response) {
      return response.json();
    }).

    then(function (jsonResponse) {
      if ('items' in jsonResponse && jsonResponse.items.length > 0) {
        dispatch(receiveList(jsonResponse.items));
      } else {
        dispatch(errorList(jsonResponse));
      }
    }).

    catch(function (err) {
      dispatch(errorList(err));
    });
  };
}

function fetchUser(username) {
  return (dispatch, getState) => {

    dispatch(requestUser());

    fetch('https://api.github.com/users/' + username, {
      method: 'get' }).


    then(function (response) {
      return response.json();
    }).

    then(function (jsonResponse) {
      if ('message' in jsonResponse && jsonResponse.message == "Not Found") {
        dispatch(errorUser(jsonResponse));
      } else {
        fetch(jsonResponse.repos_url, {
          method: 'get' }).

        then(function (response) {
          return response.json();
        }).
        then(function (jsonResponseRepos) {
          const jsonResponseRepo = Object.assign({}, jsonResponse, {
            repo_list: jsonResponseRepos });

          dispatch(receiveUser(jsonResponseRepo));
        }).
        catch(function (err) {
          dispatch(errorUser(err));
        });
      }
    }).

    catch(function (err) {
      dispatch(errorUser(err));
    });
  };
}

class InputSearch extends Component {

  render() {
    const { query, fetching, onQueryChange, onSearch } = this.props;

    const searchIcon = classnames({
      'fa fa-fw': true,
      'fa-search': fetching === false,
      'fa-spinner fa-pulse': fetching === true });


    return /*#__PURE__*/(
      React.createElement("form", {
        className: "form-inline",
        onSubmit: event => {
          event.preventDefault();
          onSearch();
        } }, /*#__PURE__*/
      React.createElement("div", { className: "input-group input-group-lg col-xs-12" }, /*#__PURE__*/
      React.createElement("input", {
        className: "form-control",
        type: "text",
        placeholder: "Entrer le nom d'utilisateur",
        value: query,
        title: "Search",
        autoFocus: true,
        onChange:
        event => onQueryChange(event.target.value) }), /*#__PURE__*/

      React.createElement("span", { className: "input-group-btn" }, /*#__PURE__*/
      React.createElement("button", {
        type: "submit",
        className: "btn btn-default" }, /*#__PURE__*/
      React.createElement("i", { className: searchIcon, "aria-hidden": "true" }))))));





  }}


class Result extends Component {

  render() {
    const { result, onFetchUser } = this.props;
    const imgClass = classnames({
      'hide': !('avatar_url' in result),
      'img-responsive': 'avatar_url' in result,
      'col-xs-2': 'avatar_url' in result });

    const contentClass = classnames({
      'col-xs-12': !('avatar_url' in result),
      'col-xs-10': 'avatar_url' in result });


    let thumbImage = "#";
    if ('avatar_url' in result) {
      thumbImage = result.avatar_url;
    }

    return /*#__PURE__*/(
      React.createElement("div", { className: "panel panel-default" }, /*#__PURE__*/
      React.createElement("div", { className: "panel-body" }, /*#__PURE__*/
      React.createElement("img", { className: imgClass,
        src: thumbImage }), /*#__PURE__*/
      React.createElement(Link, {
        className: contentClass,
        to: '/' + result.login,
        onClick: () => onFetchUser(result.login) }, /*#__PURE__*/

      React.createElement("h4", null, result.login)), /*#__PURE__*/

      React.createElement("div", { className: "clearfix" }))));



  }}


class Results extends Component {

  render() {
    const { results, failure, onFetchUser } = this.props;

    const renderedResults = results.map(
    (result, index) => /*#__PURE__*/
    React.createElement(Result, { key: index, result: result, onFetchUser: onFetchUser }));


    return /*#__PURE__*/(
      React.createElement("div", null,
      !failure &&
      renderedResults,

      failure && /*#__PURE__*/
      React.createElement("p", { className: "lead text-center" }, "Aucun résultat")));






  }}


class SearchPage extends Component {

  render() {
    const { results, failure, onFetchUser,
      query, fetching, onQueryChange, onSearch } = this.props;

    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement(InputSearch, {
        query: query,
        fetching: fetching,
        onQueryChange: onQueryChange,
        onSearch: onSearch }), /*#__PURE__*/
      React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/
      React.createElement(Results, {
        onFetchUser: onFetchUser,
        results: results,
        failure: failure })));


  }}


class UserDetails extends Component {

  render() {
    const { fetchingUser, failureUser, userDetails,
      toggleDetailsPayload, showFullDetailsPayload } = this.props;

    const repos = userDetails.repo_list;
    console.log(userDetails);
    if (!("repo_list" in userDetails)) {
      var smallRepoList = {};
    } else {
      var smallRepoList = userDetails.repo_list.map(item => item.name);
    }
    const userDetailsSansRepos = Object.assign({}, userDetails, {
      repo_list: smallRepoList });


    return /*#__PURE__*/(
      React.createElement("div", { className: "col-xs-12 col-sm-12 col-md-4 col-lg-4" },
      "avatar_url" in userDetails && /*#__PURE__*/
      React.createElement("div", { className: "col-xs-12" }, /*#__PURE__*/
      React.createElement("img", { className: "img-responsive", src: userDetails.avatar_url })),


      "name" in userDetails && /*#__PURE__*/
      React.createElement("div", { className: "col-xs-12" }, /*#__PURE__*/
      React.createElement("h2", null, /*#__PURE__*/
      React.createElement("a", { href: userDetails.html_url ? userDetails.html_url : '#' },
      userDetails.name), /*#__PURE__*/

      React.createElement("small", null, "(", userDetails.login, ")"))),



      "company" in userDetails && /*#__PURE__*/
      React.createElement("div", { className: "col-xs-12" }, /*#__PURE__*/
      React.createElement("h3", null, userDetails.company)),


      "blog" in userDetails && /*#__PURE__*/
      React.createElement("div", { className: "col-xs-12" }, /*#__PURE__*/
      React.createElement("h4", null, /*#__PURE__*/
      React.createElement("a", { href: userDetails.blog },
      userDetails.blog))),




      "email" in userDetails && /*#__PURE__*/
      React.createElement("div", { className: "col-xs-12" }, /*#__PURE__*/
      React.createElement("h4", null, userDetails.email)),


      "location" in userDetails && /*#__PURE__*/
      React.createElement("div", { className: "col-xs-12" }, /*#__PURE__*/
      React.createElement("h3", null, userDetails.location)),


      "bio" in userDetails && /*#__PURE__*/
      React.createElement("div", { className: "col-xs-12" }, /*#__PURE__*/
      React.createElement("p", null, userDetails.bio)),


      "followers" in userDetails && /*#__PURE__*/
      React.createElement("div", { className: "col-xs-6" }, /*#__PURE__*/
      React.createElement("h4", null, "Followers: ",
      userDetails.followers)),



      "following" in userDetails && /*#__PURE__*/
      React.createElement("div", { className: "col-xs-6" }, /*#__PURE__*/
      React.createElement("h4", null, "Following: ",
      userDetails.following)),



      "public_repos" in userDetails && /*#__PURE__*/
      React.createElement("div", { className: "col-xs-6" }, /*#__PURE__*/
      React.createElement("h4", null, "Repos: ",
      userDetails.public_repos)),



      "public_gists" in userDetails && /*#__PURE__*/
      React.createElement("div", { className: "col-xs-6" }, /*#__PURE__*/
      React.createElement("h4", null, "Gists: ",
      userDetails.public_gists)),



      userDetails && /*#__PURE__*/
      React.createElement("div", { className: "col-xs-12" }, /*#__PURE__*/
      React.createElement("h4", null, /*#__PURE__*/
      React.createElement("a", { className: "link-hover-hand",
        onClick: () => toggleDetailsPayload() }, "Cliquez ici pour voir les infos au complet:")),



      showFullDetailsPayload && /*#__PURE__*/
      React.createElement("pre", null,
      JSON.stringify(userDetailsSansRepos, undefined, 2)))));






  }}


class RepoListItem extends Component {

  render() {
    const { repoDetails } = this.props;


    return /*#__PURE__*/(
      React.createElement("li", { className: "list-group-item" }, /*#__PURE__*/
      React.createElement("div", { className: "panel panel-default" }, /*#__PURE__*/
      React.createElement("div", { className: "panel-heading" }, /*#__PURE__*/
      React.createElement("h4", { className: "panel-title" }, /*#__PURE__*/
      React.createElement("a", { className: "col-xs-8 col-sm-9 col-md-9 col-lg-9",
        href: repoDetails.html_url },
      repoDetails.name), /*#__PURE__*/

      React.createElement("div", { className: "col-xs-4 col-sm-3 col-md-3 col-lg-3" }, /*#__PURE__*/
      React.createElement("span", { className: "badge" },
      repoDetails.language)), /*#__PURE__*/


      React.createElement("div", { className: "clearfix" }))),


      "description" in repoDetails && repoDetails.description != "" && /*#__PURE__*/
      React.createElement("div", { className: "panel-body" }, /*#__PURE__*/
      React.createElement("p", null, repoDetails.description)))));





  }}


class UserRepoList extends Component {

  render() {
    const { fetchingUser, failureUser, userDetails } = this.props;

    const repoListTags = userDetails.repo_list.map(
    item => /*#__PURE__*/React.createElement(RepoListItem, { repoDetails: item }));



    return /*#__PURE__*/(
      React.createElement("div", { className: "col-xs-12 col-sm-12 col-md-8 col-lg-8" }, /*#__PURE__*/
      React.createElement("h3", null, " Liste des projets de l'utilisateur "), /*#__PURE__*/
      React.createElement("ul", { className: "list-group" },
      repoListTags)));



  }}


class UserPage extends Component {

  render() {
    const { fetchingUser, onFetchUser, failureUser, userDetails,
      toggleDetailsPayload, showFullDetailsPayload } = this.props;

    const searchIcon = classnames({
      'fa fa-fw': true,
      'fa-search': fetchingUser === false,
      'fa-spinner fa-pulse': fetchingUser === true });


    return /*#__PURE__*/(
      React.createElement("div", { className: "row" },
      fetchingUser && /*#__PURE__*/
      React.createElement("div", { className: "col-xs-12 text-center" }, /*#__PURE__*/
      React.createElement("i", { className: searchIcon, "aria-hidden": "true" })),


      !fetchingUser && /*#__PURE__*/
      React.createElement("div", { className: "col-xs-12" }, /*#__PURE__*/
      React.createElement(UserDetails, {
        userDetails: userDetails,
        failureUser: failureUser,
        fetchingUser: fetchingUser,
        toggleDetailsPayload: toggleDetailsPayload,
        showFullDetailsPayload: showFullDetailsPayload }), /*#__PURE__*/
      React.createElement(UserRepoList, {
        userDetails: userDetails,
        failureUser: failureUser,
        fetchingUser: fetchingUser }))));




  }}


class App extends Component {

  render() {
    const {
      results,
      query,
      fetching,
      failure,
      onQueryChange,
      onSearch,
      params,
      onFetchUser,
      fetchingUser,
      failureUser,
      userDetails,
      toggleDetailsPayload,
      showFullDetailsPayload } =
    this.props;

    return /*#__PURE__*/(
      React.createElement("div", { className: "container" }, /*#__PURE__*/
      React.createElement("div", { className: "jumbotron" },
      !params.username && /*#__PURE__*/
      React.createElement(SearchPage, {
        query: query,
        fetching: fetching,
        onQueryChange: onQueryChange,
        onFetchUser: onFetchUser,
        onSearch: onSearch,
        results: results,
        failure: failure }),

      params.username && /*#__PURE__*/
      React.createElement(UserPage, {
        fetchingUser: fetchingUser,
        onFetchUser: onFetchUser,
        failureUser: failureUser,
        userDetails: userDetails,
        toggleDetailsPayload: toggleDetailsPayload,
        showFullDetailsPayload: showFullDetailsPayload }), /*#__PURE__*/

      React.createElement("div", { className: "clearfix" }))));



  }}


// // proptypes required for App component
// App.propTypes = {
//   results: PropTypes.array.isRequired,
//   query: PropTypes.string.isRequired,
//   fetching: PropTypes.bool.isRequired,
//   failure: PropTypes.bool.isRequired,
//   onClick: PropTypes.func.isRequired,
// }

// helper functions for app container
function mapStateToProps(state) {
  const { search, user } = state;
  const { results, query, fetching, failure } = search;
  const { fetchingUser, failureUser, userDetails,
    showFullDetailsPayload } = user;
  return { results, query, fetching, failure,
    fetchingUser, failureUser, userDetails,
    showFullDetailsPayload };
}

function mapDispatchToProps(dispatch) {
  return {
    onSearch: () => dispatch(fetchList()),
    onQueryChange: query => dispatch(inputQuery(query)),
    onFetchUser: username => dispatch(fetchUser(username)),
    toggleDetailsPayload: () => dispatch(toggleUserDetailsPayloadView()) };

}

// create app container using connect()
const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

// create store using middlewares
const rootReducer = combineReducers({
  search,
  user,
  routing: routerReducer });


// create default store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(
rootReducer,
composeEnhancers(
applyMiddleware(ReduxThunk)));



const appHistory = syncHistoryWithStore(hashHistory, store);


// render the app to the page
render( /*#__PURE__*/
React.createElement(Provider, { store: store }, /*#__PURE__*/
React.createElement(Router, { history: appHistory }, /*#__PURE__*/
React.createElement(Route, { path: "/(:username)", component: AppContainer }))),

document.getElementById('app'));

