import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreatePost = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-800">
              Create New Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This is a placeholder for the Create Post page. 
              Post creation functionality will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;