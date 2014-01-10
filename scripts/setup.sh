#!/bin/bash

function assert_command {
    cmd="$1"

    command -v $cmd >/dev/null 2>&1 || {
        echo "$cmd: Command required but not found. Aborting." >&2;
        exit 1;
    }
}

function assert_commands {
    commands="$@" 
    
    for cmd in $commands; do
        assert_command $cmd
    done
}

assert_commands node npm bower grunt yo testacular ruby compass
npm install && bower install
