import React, {Component} from "react";

class App extends Component {
  state = {
    numItems: 1000,
    numRenders: 1000,
    inlineFn: false,
    items: null,
    running: false,
    lastResult: 0,
  };

  render() {
    return (
      <div>
        <div>
          <label>
            Number of buttons:
            <input
              type="number"
              onChange={this.handleNumItemsChange}
              value={this.state.numItems}
              disabled={this.state.running}
              className="num-buttons-input"
            />
          </label>
        </div>
        <div>
          <label>
            Number of renders:
            <input
              type="number"
              onChange={this.handleNumRendersChange}
              value={this.state.numRenders}
              disabled={this.state.running}
              className="num-renders-input"
            />
          </label>
        </div>
        <div>
          <label>
            Use inline functions:
            <input
              type="checkbox"
              onChange={this.handleInlineFnChange}
              checked={this.state.inlineFn}
              disabled={this.state.running}
              className="inline-fn-checkbox"
            />
          </label>
        </div>
        <div style={{margin: "20px 0"}}>
          {this.state.running ? (
            <button
              type="button"
              onClick={this.handleStopClick}
              className="stop-btn"
            >
              Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={this.handleStartClick}
              className="start-btn"
            >
              Start
            </button>
          )}
        </div>
        {this.state.running ? (
          <Benchmark
            inlineFn={this.state.inlineFn}
            items={this.state.items}
            numRenders={this.state.numRenders}
            onComplete={this.handleComplete}
          />
        ) : (
          <div className="last-result">
            Last result (ms): {this.state.lastResult}
          </div>
        )}
      </div>
    );
  }

  handleNumItemsChange = event => {
    this.setState({numItems: event.target.value});
  };

  handleNumRendersChange = event => {
    this.setState({numRenders: event.target.value});
  };

  handleInlineFnChange = event => {
    this.setState({inlineFn: event.target.checked});
  };

  handleStartClick = () => {
    const items = [];
    for (let i = 0; i < this.state.numItems; i++) {
      items.push("Item " + i);
    }
    this.setState({
      running: true,
      items: items,
      lastResult: 0,
    });
  };

  handleStopClick = () => {
    this.setState({running: false});
  };

  handleComplete = time => {
    this.setState({running: false, lastResult: time});
  };
}

class Benchmark extends Component {
  state = {counter: 0};

  componentDidMount() {
    const start = window.performance.now();
    this._interval = setInterval(() => {
      if (this.state.counter < this.props.numRenders) {
        this.setState(s => ({counter: s.counter + 1}));
      } else {
        const end = window.performance.now();
        this.props.onComplete(end - start);
        clearInterval(this._interval);
      }
    }, 0);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    return (
      <div>
        <div>Current render count: {this.state.counter}</div>
        {this.props.inlineFn ? (
          <InlineFn items={this.props.items} />
        ) : (
          <ClassMethodFn items={this.props.items} />
        )}
      </div>
    );
  }
}

class InlineFn extends Component {
  render() {
    return (
      <div>
        {this.props.items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => this.props.onClick && this.props.onClick()}
          >
            {item}
          </button>
        ))}
      </div>
    );
  }
}

class ClassMethodFn extends Component {
  render() {
    return (
      <div>
        {this.props.items.map((item, i) => (
          <button key={i} type="button" onClick={this.handleClick}>
            {item}
          </button>
        ))}
      </div>
    );
  }

  handleClick = () => {
    this.props.onClick && this.props.onClick();
  };
}

export default App;
