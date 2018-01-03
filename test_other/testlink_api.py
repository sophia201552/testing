from  testlink import testlinkapi
url="http://192.168.1.240/index.php"
key="d12989a28c53a2e690673c663b493535"
tlc=testlinkapi.TestlinkAPIClient(url,key)

tlc.listProjects()
