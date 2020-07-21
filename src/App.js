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
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  receivedData() {
    console.log("rec data:", this.state.search);
    console.log("received data");
    axios
      .get(`https://api.github.com/search/users?q=location%3ABangalore`)
      .then((res) => {
        console.log(res);
        const data = res.data.items;
        const slice = data.slice(
          this.state.offset,
          this.state.offset + this.state.perPage
        );
        const search = this.state.search;
        console.log("search:" + search);
        const postData = slice.map((pd) => {
          console.log(pd.login.toLowerCase().indexOf(search.toLowerCase()));
          if (
            search !== "" &&
            pd.login.toLowerCase().indexOf(search.toLowerCase()) === -1
          ) {
            return null;
          } else {
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
                  <Button
                    variant="contained"
                    color="primary"
                    href={pd.html_url}
                  >
                    GitHub Link
                  </Button>
                </CardActions>
              </Card>
            );
          }
        });
        console.log("post data:" + this.postData);
        this.setState({
          pageCount: Math.ceil(data.length / this.state.perPage),

          postData,
        });
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
    this.receivedData();
  };

  onChange = (e) => {
    this.setState({ search: e.target.value });
  };

  componentDidMount() {
    this.receivedData();
  }

  render() {
    console.log(this.state);
    return (
      <div className="main">
        <h1>GitHub Users Based In Bangalore</h1>
        <Input placeholder="Search user" onChange={this.onChange}></Input>&nbsp;
        <Button variant="contained" color="primary" onClick={this.onClick}>
          <SearchOutlined></SearchOutlined>
        </Button>
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
      </div>
    );
  }
}
