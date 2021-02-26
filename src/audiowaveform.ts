import { spawn } from "child_process";
import { Readable, Writable } from "stream";

interface IApi {
  input: (providedStream: Readable) => this;
  toPng: () => this;
  toJSON: () => this;
  pipe: (res: Writable) => void;
  // TODO: Add type to Promise
  promise: () => Promise<any>;
}

// TODO: Add other methods
const AudioWaveform = () => {
  let args = ["--input-filename", "-", "--input-format", "mp3"];
  let stream: Readable;

  const api: IApi = {
    input: (providedStream: Readable) => {
      stream = providedStream;

      return api;
    },

    toPng: () => {
      const baseArgs = args;

      args = [...baseArgs, "--output-format", "png"];

      return api;
    },

    toJSON: () => {
      const baseArgs = args;
      args = [...baseArgs, "--output-format", "json", "--output-filename", "-"];
      return api;
    },

    pipe: (res: Writable) => {
      const myREPL = spawn("audiowaveform", args);

      stream.pipe(myREPL.stdin);

      myREPL.stdout.pipe(res);
    },

    promise: () => {
      return new Promise((resolve) => {
        let stdoutData: any = "";

        const myREPL = spawn("audiowaveform", args);

        stream.pipe(myREPL.stdin);

        myREPL.stdout.on("data", (data) => {
          stdoutData += data;
        });

        myREPL.stdout.on("end", () => {
          resolve(stdoutData);
        });
      });
    },
  };

  return api;
};

export default AudioWaveform;
