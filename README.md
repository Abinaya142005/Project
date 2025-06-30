# To-Do List

This is a simple **To-Do List** built using **Django Rest Framework** and **MongoDB (via pymongo)**. It allows users to create, read, update, and delete (CRUD) tasks from a MongoDB database.



## 🚀 Features

- ✅ Get all tasks
- ➕ Create a new task
- 🔍 Retrieve a single task
- ✏️ Update full or partial task details
- ❌ Delete a task



## 🏗️ Tech Stack

- **Backend:** Django Rest Framework (DRF)
- **Database:** MongoDB Atlas
- **Driver:** PyMongo (`pymongo`)
- **Language:** Python 3



## 📁 Project Structure

```

myproject/
├── myapp/
│   ├── views.py          # Contains TaskListView and TaskDetailView
│   ├── urls.py           # API route mappings
├── myproject/
│   ├── settings.py       # Django settings (add DRF & tasks app)
├── manage.py

````
. 🐍 Create a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```
 📦 Install Dependencies

```bash
pip install django djangorestframework pymongo dnspython
```
 ⚙️ Update MongoDB Connection

Edit the line in `views.py`:

```python
client = MongoClient("mongodb+srv://<username>:<password>@<cluster>.mongodb.net/")
```

Replace with your actual MongoDB Atlas credentials.

---

## 🔗 API Endpoints

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| GET    | `/api/tasks/`      | Get all tasks         |
| POST   | `/api/tasks/`      | Create a new task     |
| GET    | `/api/tasks/<id>/` | Get a task by ID      |
| PUT    | `/api/tasks/<id>/` | Replace a task        |
| PATCH  | `/api/tasks/<id>/` | Partially update task |
| DELETE | `/api/tasks/<id>/` | Delete a task         |

---

## 📌 Sample Task Object

```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "title": "Learn Django",
  "completed": false
}
```

---

## 🔍 Testing the API

Use **Postman**, **curl**, or **any frontend** to test the API:

```bash
# Create a new task
curl -X POST http://127.0.0.1:8000/api/tasks/ \
-H "Content-Type: application/json" \
-d '{"title": "Buy milk", "completed": false}'
```
---

Abinaya.S
Intern
