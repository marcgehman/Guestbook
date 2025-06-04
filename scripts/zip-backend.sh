
# Zip our backend for AWS deployment.
# 1. Create build directory
# 2. Install Python dependencies into build/python
# 3. Copy the app directory into build/python
# 4. Zip the contents of build/python into guestbook_lambda.zip in backend/build/

cd backend
mkdir -p build/python

pip install -r requirements.txt --target build/python

cp -r app build/python/app

cd build/python && zip -r ../guestbook_lambda.zip .