import os
import svn.local
import svn.remote


def get_local_revision_info(remote_repo_url):
    result = {}
    local_repo = svn.local.LocalClient(os.getcwd())
    result['current_rev'] = local_repo.info().get('commit_revision', None)
    remote_repo = svn.remote.RemoteClient(remote_repo_url)
    result['latest_rev'] = remote_repo.info().get('commit_revision', None)
    return result

