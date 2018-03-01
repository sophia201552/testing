import unittest
from beopWeb.mod_workflow.Team import Team, FieldType
from beopWeb.mod_workflow.TaskGroup import TaskGroup
from beopWeb.mod_workflow.Task import Task


class WorkflowTestCase(unittest.TestCase):
    def test_create_team(self):
        team = Team()

        team_name = 'team_name'
        team_desc = 'team_desc'
        tags = ['tag1', 'tag2', 'tag3']

        team_arch = [{
            'id': '1',
            'type': 1,
            'members': [1]},
            {'id': '2',
             'type': 2,
             'members': [68, 89, 12]},
            {'id': '3',
             'name': '总监',
             'type': 3,
             'members': [14, 33, 55]},
            {'id': '4',
             'name': '经理',
             'type': 3,
             'members': [66, 77, 88]
             }, {
                'id': '5',
                'name': '工程师',
                'type': 3,
                'members': [55, 12, 31]
            }, {
                'id': '6',
                'name': '人事',
                'type': 3,
                'members': [9, 7, 5]
            }, {
                'id': '7',
                'name': '财务',
                'type': 3,
                'members': [10, 66, 99]
            }]

        team_process = [{
            "template_id": "56ebe704e153db92a86c4a49",
            "name": "order1",
            "nodes": [{
                "behaviour": 1,
                "arch_id": '6',
                "node_type": 1
            }, {
                "behaviour": 1,
                "arch_id": '3',
                "node_type": 2,
                "member": [14]
            }, {
                "behaviour": 2,
                "arch_id": '4',
                "node_type": 1
            }, {
                "behaviour": 2,
                "arch_id": '4',
                "node_type": 2,
                "member": [66]
            }, {
                "behaviour": 1,
                "arch_id": '2',
                "node_type": 2,
                "member": [12]
            }, {
                "behaviour": 1,
                "arch_id": '4',
                "node_type": 1
            }]
        }]

        team_creator = 1

        saved_team = team.create_team(team_name, team_desc, tags, team_arch, team_process, team_creator)
        inserted_id = saved_team.inserted_id
        assert inserted_id

        found_team = team.get_team_by_id(inserted_id)

        assert found_team

        assert team.delete_team(inserted_id, 1)

        found_team = team.get_team_by_id(inserted_id)

        assert not found_team

    def test_get_team_by_user_id(self):
        user_id = 1
        team = Team()
        team = team.get_team_by_user_id(user_id)
        assert team

    def test_get_group_by_user_id(self):
        user_id = 1
        tg = TaskGroup()
        assert tg.get_task_group_by_user_id(user_id)

    def test_get_user_arch_id_in_group(self):
        user_id = 68
        tg = TaskGroup()
        assert tg.get_arch_ids_by_user_id(user_id)

    def test_quit_team(self):
        team = Team()

    def test_delete_all_task(self):
        task = Task()
        rv = task.mark_task_as_delete_by_taskGroupId(222)
        print(rv)
