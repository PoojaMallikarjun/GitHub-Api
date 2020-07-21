import React, { Component } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { SearchOutlined } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import "./App.css";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      data: [],
      perPage: 5,
      currentPage: 0,
      search: "",
      searchData: "",
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  searchUser() {
    let searchData = this.state.data.filter((item) => {
      if (item.login === this.state.search) {
        return item;
      } else {
        return 0;
      }
    });
    if (searchData.length > 0) {
      console.log(searchData);
      this.setState({
        searchData,
      });
    } else {
      this.setState({ searchData: "NotFound" });
    }
  }

  receivedData() {
    console.log(this.state);
    const sliceData = this.state.data.slice(
      this.state.offset,
      this.state.offset + this.state.perPage
    );

    return sliceData.map((pd) => {
      return (
        <Card className="card">
          <CardActionArea>
            <img
              className="img"
              style={{ height: "140", width: "342" }}
              src={pd.avatar_url}
              alt=""
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Username: {pd.login}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button variant="contained" color="primary" href={pd.html_url}>
              GitHub Link
            </Button>
          </CardActions>
        </Card>
      );
    });
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    console.log("handle page click" + selectedPage);
    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.receivedData();
      }
    );
  };

  onClick = (e) => {
    console.log("on click");
    this.searchUser();
  };

  onChange = (e) => {
    this.setState({ search: e.target.value });
  };

  async componentDidMount() {
    let res = await axios.get(
      `https://api.github.com/search/users?q=location%3ABangalore`
    );
    this.setState({
      data: res.data.items,
      pageCount: Math.ceil(res.data.items.length / this.state.perPage),
    });
  }

  reload() {
    window.location.reload();
  }

  render() {
    return (
      <div className="main">
        <h1>GitHub Users Based In Bangalore</h1>
        <Input placeholder="Search user" onChange={this.onChange}></Input>&nbsp;
        <Button variant="contained" color="primary" onClick={this.onClick}>
          <SearchOutlined></SearchOutlined>
        </Button>
        {this.state.searchData === "" ? this.receivedData() : null}
        {this.state.postData}
        {this.state.search !== "" ? null : (
          <div className="paginate">
            <ReactPaginate
              previousLabel={"prev"}
              nextLabel={"next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            />
          </div>
        )}
        {this.state.searchData === "NotFound" ? (
          <div>
            <Button variant="contained" color="primary" onClick={this.reload}>
              BACK
            </Button>
            <h1>User not found</h1>
          </div>
        ) : this.state.searchData.length > 0 ? (
          <div>
            <Button variant="contained" color="primary" onClick={this.reload}>
              Back
            </Button>
            <Card className="card">
              <CardActionArea>
                <img
                  className="img"
                  style={{ height: "140", width: "342" }}
                  src={this.state.searchData[0].avatar_url}
                  alt=""
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Username: {this.state.searchData[0].login}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  href={this.state.searchData[0].html_url}
                >
                  GitHub Link
                </Button>
              </CardActions>
            </Card>
          </div>
        ) : null}
      </div>
    );
  }
}
