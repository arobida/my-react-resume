import React, { Component, img } from 'react';
import axios from 'axios';
import { Button, Icon, Dimmer, Loader, Modal, Header, Card, List, Grid, Image, Divider, Responsive, Segment } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import creds from "../creds";

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      loader: true,
      error: null
    }
  }
  componentDidMount() {
    this.getRepos();
  }
  getRepos() {
    const username = "arobida";
    let url = `https://api.github.com/users/${username}/repos`;

    // Make a request for a user repos
    axios({
      method: 'get',
      url: url,
      auth: {
        username: creds.username,
        password: creds.password
      }
    })
      .then(res => {
        var id = res.data.id;
        console.log(typeof (res), res)
        let project = res.data.map((repo) => {
          let card;
          let content;
          // con rendering the preview link
          if (repo.homepage == null) {
            content = "No preview available";
          } else {
            content = <a id="projectLinks" target="_blank" href={repo.homepage}>Preview</a>
          }

          if (repo.name.charAt(0) == "_") {

          }
          return(
            <Card key={repo.id}>
              <Card.Content>
                <h4 style={{ color: "#e91e63" }}>{repo.name.toUpperCase()}</h4>
                <Card.Meta>Last Update: {repo.pushed_at.slice(0, 10)}</Card.Meta>
                <Card.Description>{repo.description}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <a id="projectLinks" target="_blank" href={repo.html_url}>GitHub</a><hr />{content}
              </Card.Content>
            </Card>
          )
        })
        this.setState(prevState => ({
          // assuming that both prevState.projects and response are strings, but not quite sure what this is trying to do?
          // if they're arrays, this should be
          // projects: [...prevState.projects, ...response],
          projects: project,
          loader: prevState.loader = false
        }))
        console.log("state", this.state.projects)
      })
      .catch((error) => {
        console.log(error)
        error = "error";
        this.setState(prevState => ({
          loader: prevState.error = true,
        }))
      });
  }

  render() {
    let content;

    if (this.state.loader == true) {
      content = <Dimmer as="div" active><Loader>Loading...</Loader></Dimmer>;
    } else if (this.state.loader == false) {
      content = this.state.projects
    } else if (this.state.error == true) {
      content =
        <Modal basic size='small' closeIcon>
          <Header icon='error' content='Request Failed' />
          <Modal.Content>
            <p>The request has failed...Please try refreshing this page or come back later.</p>
          </Modal.Content>
          <Modal.Actions>
            <Button color='green' inverted>
              <Icon name='checkmark' /> Okay
      </Button>
          </Modal.Actions>
        </Modal>
    }

    return (
      <div id="projects">
        <div id="cards">
          <Responsive as={Card.Group} itemsPerRow={1} maxWidth={650}>
            {content}
          </Responsive>
          <Responsive as={Card.Group} itemsPerRow={4} minWidth={650} maxWidth={2559}>
            {content}
          </Responsive>
        </div>
      </div>
    );
  }
}

export default Projects