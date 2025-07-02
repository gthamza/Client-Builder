import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import { useToast } from "../hooks/use-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Edit,
  Camera,
  Star,
  Trophy,
  Clock,
  Target,
} from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@clienthub.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    title: "Senior Project Manager",
    company: "ClientHub Inc.",
    bio: "Experienced project manager with 8+ years in digital transformation and client relations. Passionate about delivering exceptional results and building strong client partnerships.",
    website: "https://johndoe.dev",
    joinDate: "January 2022",
  });

  const { toast } = useToast();

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const stats = [
    {
      label: "Projects Completed",
      value: "24",
      icon: Trophy,
      color: "text-primary",
    },
    {
      label: "Active Projects",
      value: "6",
      icon: Target,
      color: "text-accent",
    },
    {
      label: "Hours Logged",
      value: "1,240",
      icon: Clock,
      color: "text-success",
    },
    {
      label: "Client Rating",
      value: "4.9",
      icon: Star,
      color: "text-warning",
    },
  ];

  const achievements = [
    {
      title: "Top Performer 2023",
      description: "Highest client satisfaction rating",
      date: "Dec 2023",
      icon: "🏆",
    },
    {
      title: "Project Excellence",
      description: "Delivered 5 projects ahead of schedule",
      date: "Nov 2023",
      icon: "⭐",
    },
    {
      title: "Team Leader",
      description: "Successfully managed team of 12",
      date: "Oct 2023",
      icon: "👥",
    },
  ];

  const skills = [
    { name: "Project Management", level: 95 },
    { name: "Client Relations", level: 90 },
    { name: "Team Leadership", level: 85 },
    { name: "Strategic Planning", level: 88 },
    { name: "Risk Management", level: 82 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          <Edit className="w-4 h-4 mr-2" />
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/api/placeholder/96/96" alt="Profile" />
                    <AvatarFallback className="bg-primary-100 text-primary-700 text-2xl">
                      {profileData.firstName[0]}
                      {profileData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {profileData.firstName} {profileData.lastName}
                  </h3>
                  <p className="text-muted-foreground">{profileData.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {profileData.company}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={profileData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-muted-foreground">
                      {skill.level}%
                    </span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Performance Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        stat.color === "text-primary"
                          ? "bg-primary/10"
                          : stat.color === "text-accent"
                          ? "bg-accent/10"
                          : stat.color === "text-success"
                          ? "bg-success/10"
                          : "bg-warning/10"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="font-semibold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {profileData.email}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {profileData.phone}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {profileData.location}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Joined {profileData.joinDate}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {profileData.title}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {achievement.title}
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {achievement.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.date}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
