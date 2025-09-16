#!/bin/bash
cd /home/kavia/workspace/code-generation/seamless-sign-up-experience-134624-134635/signup_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

